import { DataSource } from '../../../../../shared/types/data-source';
import { ParametersByName } from '../../../../../shared/types/parameters-by-name';
import * as echarts from 'echarts';
import { TIME_KEY } from '../../../../../shared/const/time-key';

export const getChartYAxis = (
  size: number,
  data: DataSource[][],
  parameters: ParametersByName,
): echarts.EChartsOption['yAxis'] => {
  const axes: echarts.EChartsOption['yAxis'] = [];

  for (let i = 0; i < size; i++) {
    const axis: echarts.EChartsOption['yAxis'] = {
      type: 'value',
      scale: true,
      axisPointer: {
        show: false,
      },
    };

    /**
     * Data can be empty
     */
    if (data[i][0]) {
      const name = data[i][0].name;
      const color = parameters[name].color;

      if (name === TIME_KEY) {
        axis.type = 'time' as any;
        axis.splitLine = { show: true };
      }

      axis.name = name;
      axis.nameTextStyle = { color, align: 'left' };
    }

    axes.push(axis);
  }

  return axes;
};
