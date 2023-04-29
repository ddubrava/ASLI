import * as echarts from 'echarts';
import { Data } from '../../../../../shared/types/data';
import { ParametersByName } from '../../../../../shared/types/parameters-by-name';
import { getChartXAxis } from './get-chart-x-axis';
import { getChartYAxis } from './get-chart-y-axis';
import { getChartSeries } from './get-chart-series';
import { setOptionForZoningTypeArrange } from './set-option-for-zoning-type-arrange';
import { setOptionForZoningTypeCombine } from './set-option-for-zoning-type-combine';

/**
 * @param data data for a dataset
 * @param parameters selected parameters from a sidenav
 * @param arrange true if ZoningType.Arrange is used
 * @param dataZoomRange start and end values for data zoom
 */
export const getChartOption = (
  data: Data,
  parameters: ParametersByName,
  arrange = true,
  [dataZoomStart, dataZoomEnd] = [0, 100],
): echarts.EChartsOption => {
  const dataValues = Object.values(data);
  const size = dataValues.length;
  const indices = new Array(size).fill(0).map((_, i) => i);

  const option: echarts.EChartsOption = {
    tooltip: null,
    axisPointer: null,
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: indices,
        minSpan: 5,
        start: dataZoomStart,
        end: dataZoomEnd,
      },
      {
        xAxisIndex: indices,
        minSpan: 5,
        start: dataZoomStart,
        end: dataZoomEnd,
        labelFormatter: (value, valueStr) => valueStr.split(' ').at(-1),
      },
    ],
    xAxis: getChartXAxis(size, dataValues, parameters),
    yAxis: getChartYAxis(size, dataValues, parameters),
    series: getChartSeries(size, dataValues, parameters),
    dataset: dataValues.map((d) => ({ source: d })),
  };

  if (arrange && size > 1) {
    setOptionForZoningTypeArrange(option, size);
  } else {
    setOptionForZoningTypeCombine(option, size);
  }

  return option;
};
