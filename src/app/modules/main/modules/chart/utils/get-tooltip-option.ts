import * as echarts from 'echarts';
import { convertTimestampToTime } from '../../../../../shared/utils/convert-timestamp-to-time';
import { DataSource } from '../../../../../shared/types/data-source';

export const getTooltipOption = (): echarts.TooltipComponentOption => ({
  trigger: 'axis',
  formatter(params) {
    const time = convertTimestampToTime((params[0].data as DataSource).x);

    let text = `${time}`;

    params.forEach((param) => {
      const { name, y } = param.data as DataSource;
      text += `<br>${param.marker} ${y}, ${name}`;
    });

    return text;
  },
});
