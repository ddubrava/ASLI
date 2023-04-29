import { getAxisPointerOption } from './get-axis-pointer-option';
import * as echarts from 'echarts';
import { getGridTopAndHeightValues } from './get-grid-top-and-height-values';

export const setOptionForZoningTypeArrange = (option: echarts.EChartsOption, size: number) => {
  option.axisPointer = getAxisPointerOption();

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

  option.grid = getGridTopAndHeightValues(size);
};
