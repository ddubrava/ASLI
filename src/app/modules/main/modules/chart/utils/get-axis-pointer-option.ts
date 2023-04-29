import * as echarts from 'echarts';
import { DataSource } from '../../../../../shared/types/data-source';
import { convertTimestampToTime } from '../../../../../shared/utils/convert-timestamp-to-time';

export const getAxisPointerOption = (): echarts.AxisPointerComponentOption => ({
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
      const seriesData = params.seriesData[0];

      /**
       * On zooming in values can be undefined, since dataZoom.filterMode is set.
       *
       * @todo figure out if it's possible to get rid of this hack
       */
      if (!seriesData?.value) {
        return '-';
      }

      const { name, x, y } = seriesData.value as DataSource;
      const time = convertTimestampToTime(x);

      return `${y}, ${name} (${time})`;
    },
  },
});
