import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { DataService } from '../../../../shared/services/data/data.service';
import { combineLatest, debounceTime, Subject, takeUntil } from 'rxjs';
import { getChartOption } from './utils/get-chart-option';
import { OptionsService } from '../../../../shared/services/options/options.service';
import { ZoningType } from '../../../../../../app/types/zoning-type';
import { ParametersService } from '../../../../shared/services/parameters/parameters.service';
import { CHART_ID } from './const/chart-id';
import { DataZoomService } from '../../../../shared/services/data-zoom/data-zoom.service';

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
    private dataZoomService: DataZoomService,
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

  private onDataZoomChanges() {
    this.chart.on('dataZoom', () => {
      /**
       * This is the only approach that works, since data zoom startValue and endValue are invalid,
       * they are formatted by EChart and cannot be mapped to original values.
       * E.g. the original value is 1682850281210, ECharts returns 1682850281399.8394
       *
       * @see https://github.com/apache/echarts/issues/17919
       */
      const xAxisExtent: [number, number] = (this.chart as any)
        .getModel()
        .getComponent('xAxis', 0)
        .axis.scale.getExtent();

      this.dataZoomService.dataZoom$.next(xAxisExtent);
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
