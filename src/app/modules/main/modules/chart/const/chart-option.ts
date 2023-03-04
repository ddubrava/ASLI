import * as echarts from 'echarts';
import { calculateGrid } from '../utils/calculate-grid';

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
  },
  {
    type: 'value',
  },
  {
    type: 'value',
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

/**
 * @param size slices xAxis, yAxis and series
 * @param useGrid set grid index if true
 */
export const chartOption = (size: number, useGrid = true): echarts.EChartsOption => {
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
    },
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

  if (useGrid && size > 1) {
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
  }

  return option;
};
