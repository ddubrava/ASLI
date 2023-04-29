import * as echarts from 'echarts';
import { getTooltipOption } from './get-tooltip-option';
import { getGridLeftAndWidthValues } from './get-grid-left-and-width-values';

export const setOptionForZoningTypeCombine = (option: echarts.EChartsOption, size: number) => {
  option.tooltip = getTooltipOption();

  const axisOffset = 60;

  option.grid = getGridLeftAndWidthValues(size, axisOffset);

  option.yAxis = (option.yAxis as echarts.YAXisComponentOption[]).map((axis, i) => ({
    ...axis,
    position: 'left',
    offset: axisOffset * i,
    nameRotate: size > 1 ? 90 : 0,
    nameLocation: size > 1 ? 'middle' : 'end',
    nameGap: size > 1 ? 35 : 15,
    axisLine: {
      show: true,
    },
  }));

  /**
   * We need only one xAxis line
   */
  (option.xAxis as echarts.YAXisComponentOption[]).length = 1;

  option.series = (option.series as echarts.SeriesOption[]).map((series, i) => ({
    ...series,
    yAxisIndex: i,
  }));
};
