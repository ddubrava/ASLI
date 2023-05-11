import * as echarts from 'echarts';
import { convertTimestampToTime } from '../../../../../shared/utils/convert-timestamp-to-time';
import { DataSource } from '../../../../../shared/types/data-source';
import { TIME_KEY } from '../../../../../shared/const/time-key';
import { decimalDegreesFields } from '../../../../../shared/const/decimal-degrees-fields';
import { convertDecimalDegrees } from '../../../../../shared/utils/convert-decimal-degrees';

export const getTooltipOption = (): echarts.TooltipComponentOption => ({
  trigger: 'axis',
  formatter(params) {
    const time = convertTimestampToTime((params[0].data as DataSource).x);

    let text = `${time}`;

    params.forEach((param) => {
      const { name, y } = param.data as DataSource;

      if (name === TIME_KEY) {
        return;
      }

      let value: string | number = y;

      if (decimalDegreesFields.some((field) => name.toLowerCase().includes(field))) {
        value = convertDecimalDegrees(y);
      }

      text += `<br>${param.marker} ${value}, ${name}`;
    });

    return text;
  },
});
