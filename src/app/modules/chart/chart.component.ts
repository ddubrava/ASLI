import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { ParametersService } from '../../shared/services/parameters/parameters.service';
import { DatasetService } from '../../shared/services/dataset/dataset.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { chartOption } from './const/chart-option';
import { OptionsService } from '../../shared/services/options/options.service';
import { ZoningType } from '../../shared/types/zoning-type';

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
  ) {}

  ngAfterViewInit() {
    this.initChart();
    this.setOption(chartOption(1));
    this.onParametersAndOptionsChange();
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

        const option = {
          ...chartOption(dataset.length, options.zoning === ZoningType.Arrange),
          dataset,
        };

        parameters.forEach((param) => {
          if (param.selected) {
            // @todo find index by title. refactor this later. complexity is awful
            const index = dataset.findIndex((v) => Object.keys(v.source[0])[1] === param.title);
            option.yAxis[index].name = param.title;
            option.yAxis[index].nameTextStyle = { color: param.color };
            option.series[index].lineStyle = { color: param.color };
          }
        });

        this.setOption(option);
      });
  }
}
