import * as echarts from 'echarts';
import { DataSource } from '../../../../../shared/types/data-source';
import { convertTimestampToTime } from '../../../../../shared/utils/convert-timestamp-to-time';
import { TIME_KEY } from '../../../../../shared/const/time-key';
import { decimalDegreesFields } from '../../../../../shared/const/decimal-degrees-fields';
import { convertDecimalDegrees } from '../../../../../shared/utils/convert-decimal-degrees';

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

      return getFormattedLabel(seriesData);
    },
  },
});

const getFormattedLabel = (seriesData: echarts.DefaultLabelFormatterCallbackParams) => {
  const { name, x, y } = seriesData.value as DataSource;

  const time = convertTimestampToTime(x);
  const timeLabel = `${name} (${time})`;

  if (name === TIME_KEY) {
    return timeLabel;
  }

  /**
   * If a name includes one of the decimal degrees fields.
   */
  if (decimalDegreesFields.some((field) => name.toLowerCase().includes(field))) {
    return `${convertDecimalDegrees(y)}, ${timeLabel}`;
  }

  return `${y}, ${timeLabel}`;
};
