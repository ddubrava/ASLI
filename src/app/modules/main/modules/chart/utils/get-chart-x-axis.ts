import { DataSource } from '../../../../../shared/types/data-source';
import { ParametersByName } from '../../../../../shared/types/parameters-by-name';
import * as echarts from 'echarts';

export const getChartXAxis = (
  size: number,
  data: DataSource[][],
  parameters: ParametersByName,
): echarts.EChartsOption['xAxis'] => {
  const axes: echarts.EChartsOption['xAxis'] = [];

  for (let i = 0; i < size; i++) {
    axes.push({
      type: 'time',
      name: 't',
    });
  }

  return axes;
};
