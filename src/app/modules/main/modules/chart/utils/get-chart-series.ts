import { DataSource } from '../../../../../shared/types/data-source';
import { ParametersByName } from '../../../../../shared/types/parameters-by-name';
import * as echarts from 'echarts';

export const getChartSeries = (
  size: number,
  data: DataSource[][],
  parameters: ParametersByName,
): echarts.EChartsOption['series'] => {
  const axes: echarts.EChartsOption['series'] = [];

  for (let i = 0; i < size; i++) {
    const axis: echarts.EChartsOption['series'] = {
      type: 'line',
      datasetIndex: i,
      /**
       * Otherwise, performance is poor.
       *
       * @see https://echarts.apache.org/examples/en/editor.html?c=area-simple
       */
      symbol: 'none',
      sampling: 'lttb',
    };

    /**
     * Data can be empty
     */
    if (data[i][0]) {
      const name = data[i][0].name;
      const color = parameters[name].color;

      axis.name = name;
      axis.color = color;
      axis.lineStyle = { color };
    }

    axes.push(axis);
  }

  return axes;
};
