import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { DataService } from '../../../../shared/services/data/data.service';
import { combineLatest, debounceTime, Subject, takeUntil } from 'rxjs';
import { getChartOption } from './utils/get-chart-option';
import { OptionsService } from '../../../../shared/services/options/options.service';
import { ZoningType } from '../../../../../../app/types/zoning-type';
import { ParametersService } from '../../../../shared/services/parameters/parameters.service';
import { CHART_ID } from './const/chart-id';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  readonly chartId = CHART_ID;

  private destroy$ = new Subject<void>();

  private chart: echarts.ECharts;

  constructor(
    private dataService: DataService,
    private optionsService: OptionsService,
    private parameterService: ParametersService,
  ) {}

  ngAfterViewInit() {
    this.initChart();
    this.onDataAndOptionsChanges();
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
        this.setOption(
          getChartOption(
            data,
            parameters,
            options.zoning === ZoningType.Arrange,
            this.getDataZoomRange(),
          ),
        );
      });
  }

  /**
   * Returns chart.dataZoom values.
   * Default values are 0 and 100.
   */
  private getDataZoomRange(): [number, number] {
    let start = 0;
    let end = 100;

    const option = this.chart.getOption();

    if (option) {
      const { dataZoom } = option;

      start = dataZoom[0].start;
      end = dataZoom[0].end;
    }

    return [start, end];
  }
}
