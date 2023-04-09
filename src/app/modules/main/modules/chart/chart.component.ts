import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { ParametersService } from '../../../../shared/services/parameters/parameters.service';
import { DatasetService } from '../../../../shared/services/dataset/dataset.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { getChartOptions } from './const/get-chart-options';
import { OptionsService } from '../../../../shared/services/options/options.service';
import { ZoningType } from '../../../../shared/types/zoning-type';
import { DataZoomService } from '../../../../shared/services/data-zoom/data-zoom.service';
import { DataZoomOption } from 'echarts/types/src/component/dataZoom/DataZoomModel';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  parameters$ = this.parametersService.parameters$;

  options$ = this.optionsService.options$;

  private destroy$ = new Subject<void>();

  private chart: echarts.ECharts;

  constructor(
    private parametersService: ParametersService,
    private optionsService: OptionsService,
    private datasetService: DatasetService,
    private dataZoomService: DataZoomService,
  ) {}

  ngAfterViewInit() {
    this.initChart();
    this.setOption(getChartOptions(1, true));
    this.onParametersAndOptionsChange();
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

  private onParametersAndOptionsChange() {
    combineLatest([this.parameters$, this.options$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([parameters, options]) => {
        const dataset = this.datasetService.getData(parameters);

        const option: echarts.EChartsOption = {
          ...getChartOptions(dataset.length, options.zoning === ZoningType.Arrange),
          dataset,
        };

        parameters.forEach((param) => {
          if (param.selected) {
            /**
             * @todo refactor this complexity and this logic.
             *   we mix logic from getChartOptions + this. so i think we should everything in getChartOptions
             */
            const index = dataset.findIndex((v) => v.source[0].name === param.title);

            option.yAxis[index].name = param.title;
            option.xAxis[index].name = 't (сек)';
            option.yAxis[index].nameTextStyle = { color: param.color };
            option.series[index].lineStyle = { color: param.color };

            /**
             * Options for a tooltip
             */
            option.series[index].name = param.title;
            option.series[index].color = param.color;
          }
        });

        this.setOption(option);
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
