import * as echarts from 'echarts';
import { calculateGrid } from '../utils/calculate-grid';
import { DataSource } from '../../../../../shared/types/data-source';

const chartXAxis: echarts.EChartsOption['xAxis'] = [
  {
    type: 'category',
  },
  {
    type: 'category',
  },
  {
    type: 'category',
  },
];

const chartYAxis: echarts.EChartsOption['yAxis'] = [
  {
    type: 'value',
    axisPointer: {
      show: false,
    },
  },
  {
    type: 'value',
    axisPointer: {
      show: false,
    },
  },
  {
    type: 'value',
    axisPointer: {
      show: false,
    },
  },
];

const chartSeries: echarts.EChartsOption['series'] = [
  {
    type: 'line',
  },
  {
    type: 'line',
    datasetIndex: 1,
  },
  {
    type: 'line',
    datasetIndex: 2,
  },
];

const getAxisPointerConfig = (): echarts.AxisPointerComponentOption => ({
  show: true,
  animation: false,
  link: [
    {
      xAxisIndex: 'all',
    },
  ],
  lineStyle: {
    type: 'solid',
    width: 2,
  },
  label: {
    margin: 25,
    formatter(params) {
      const series = params.seriesData[0].value as DataSource;

      /**
       * On zooming in values can be undefined
       */
      if (!series) {
        return '-';
      }

      return `${series.name} ${series.y} ${series.unit}`;
    },
  },
});

const getTooltipConfig = (): echarts.TooltipComponentOption => ({
  trigger: 'axis',
  formatter(params) {
    let text = '';

    text += `${params[0].data.x} секунд`;

    params.forEach((param) => {
      text += `<br>${param.marker} ${param.data.name} ${param.data.y} ${param.data.unit}`;
    });

    return text;
  },
});

/**
 * @param size slices xAxis, yAxis and series
 * @param arrange true if ZoningType.Arrange is used
 */
export const getChartOptions = (size: number, arrange = true): echarts.EChartsOption => {
  const option: echarts.EChartsOption = {
    tooltip: null,
    axisPointer: null,
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1, 2],
      },
      {
        xAxisIndex: [0, 1, 2],
      },
    ],
    xAxis: chartXAxis.slice(0, size),
    yAxis: chartYAxis.slice(0, size),
    series: chartSeries.slice(0, size),
  };

  /**
   * Should be ZoningType.Arrange
   * and number of plots > 1
   */
  if (arrange && size > 1) {
    option.axisPointer = getAxisPointerConfig();

    option.xAxis = (option.xAxis as echarts.XAXisComponentOption[]).map((axis, i) => ({
      ...axis,
      gridIndex: i,
    }));

    option.yAxis = (option.yAxis as echarts.YAXisComponentOption[]).map((axis, i) => ({
      ...axis,
      gridIndex: i,
    }));

    option.series = (option.series as echarts.SeriesOption[]).map((series, i) => ({
      ...series,
      xAxisIndex: i,
      yAxisIndex: i,
    }));

    option.grid = calculateGrid(size);
  } else {
    option.tooltip = getTooltipConfig();

    if (size > 1) {
      option.grid = {
        left: '15%',
      };
    }

    option.yAxis = (option.yAxis as echarts.YAXisComponentOption[]).map((axis, i) => ({
      ...axis,
      position: 'left',
      offset: 60 * i,
      nameRotate: size > 1 ? 90 : 0,
      nameLocation: size > 1 ? 'middle' : 'end',
      nameGap: size > 1 ? 35 : 15,
      axisLine: {
        show: true,
      },
    }));

    option.series = (option.series as echarts.SeriesOption[]).map((series, i) => ({
      ...series,
      yAxisIndex: i,
    }));
  }

  return option;
};
