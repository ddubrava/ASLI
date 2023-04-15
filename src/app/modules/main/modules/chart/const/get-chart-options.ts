import * as echarts from 'echarts';
import { calculateGrid } from '../utils/calculate-grid';
import { DataSource } from '../../../../../shared/types/data-source';
import { Data } from '../../../../../shared/types/data';
import { ParametersByName } from '../../../../../shared/types/parameters-by-name';

const getChartXAxis = (
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

const getChartYAxis = (
  size: number,
  data: DataSource[][],
  parameters: ParametersByName,
): echarts.EChartsOption['yAxis'] => {
  const axes: echarts.EChartsOption['yAxis'] = [];

  for (let i = 0; i < size; i++) {
    const axis: echarts.EChartsOption['yAxis'] = {
      type: 'value',
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

      axis.name = name;
      axis.nameTextStyle = { color };
    }

    axes.push(axis);
  }

  return axes;
};

const geChartSeries = (
  size: number,
  data: DataSource[][],
  parameters: ParametersByName,
): echarts.EChartsOption['series'] => {
  const axes: echarts.EChartsOption['series'] = [];

  for (let i = 0; i < size; i++) {
    const axis: echarts.EChartsOption['series'] = {
      type: 'line',
      datasetIndex: i,
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
       * On zooming in values can be undefined,
       * it's a ECharts bug, I guess.
       */
      if (!series) {
        return '-';
      }

      const { name, y, time } = series;

      return `${y}, ${name} (${time})`;
    },
  },
});

const getTooltipConfig = (): echarts.TooltipComponentOption => ({
  trigger: 'axis',
  formatter(params) {
    let text = '';

    text += `${(params[0].data as DataSource).time}`;

    params.forEach((param) => {
      const { name, y } = param.data as DataSource;
      text += `<br>${param.marker} ${y}, ${name}`;
    });

    return text;
  },
});

/**
 * @param data data for a dataset
 * @param parameters selected parameters from a sidenav
 * @param arrange true if ZoningType.Arrange is used
 */
export const getChartOptions = (
  data: Data,
  parameters: ParametersByName,
  arrange = true,
): echarts.EChartsOption => {
  const dataValues = Object.values(data);
  const size = dataValues.length;

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
    xAxis: getChartXAxis(size, dataValues, parameters),
    yAxis: getChartYAxis(size, dataValues, parameters),
    series: geChartSeries(size, dataValues, parameters),
    dataset: dataValues.map((d) => ({ source: d })),
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
