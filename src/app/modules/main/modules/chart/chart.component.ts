import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { DataService } from '../../../../shared/services/data/data.service';
import { combineLatest, debounceTime, Subject, takeUntil } from 'rxjs';
import { getChartOptions } from './utils/get-chart-options';
import { OptionsService } from '../../../../shared/services/options/options.service';
import { ZoningType } from '../../../../shared/types/zoning-type';
import { DataZoomService } from '../../../../shared/services/data-zoom/data-zoom.service';
import { ParametersService } from '../../../../shared/services/parameters/parameters.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private chart: echarts.ECharts;

  constructor(
    private dataService: DataService,
    private optionsService: OptionsService,
    private dataZoomService: DataZoomService,
    private parameterService: ParametersService,
  ) {}

  ngAfterViewInit() {
    this.initChart();
    this.onDataAndOptionsChanges();
    this.onDataZoomChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initChart() {
    const chartElem = document.getElementById('chart');
    this.chart = echarts.init(chartElem);
  }

  private setOption(option: echarts.EChartsOption) {
    this.chart.setOption(option, true);
  }

  private onDataAndOptionsChanges() {
    combineLatest([
      this.dataService.currentData$,
      this.parameterService.selectedParameters$,
      this.optionsService.options$,
    ])
      .pipe(
        /**
         * When currentData & selectedParameters$ are changed at the same time
         */
        debounceTime(0),
        takeUntil(this.destroy$),
      )
      .subscribe(([data, parameters, options]) => {
        this.setOption(getChartOptions(data, parameters, options.zoning === ZoningType.Arrange));
      });
  }

  private onDataZoomChanges() {
    this.chart.on('dataZoom', () => {
      const { startValue, endValue } = this.chart.getOption().dataZoom[0];

      this.dataZoomService.dataZoom$.next({
        startValue: startValue as number,
        endValue: endValue as number,
      });
    });
  }
}
