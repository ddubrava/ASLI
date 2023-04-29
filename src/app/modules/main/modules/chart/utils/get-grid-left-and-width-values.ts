import { CHART_ID } from '../const/chart-id';
import * as echarts from 'echarts';

/**
 * Calculates grid left and grid width, so vertical axis lines are in bounds.
 *
 * @param size number of grids
 * @param axisOffset yAxis.offset
 */
export const getGridLeftAndWidthValues = (
  size: number,
  axisOffset: number,
): Pick<echarts.GridComponentOption, 'left' | 'width'> => {
  const { clientWidth } = document.querySelector(`#${CHART_ID}`);

  /**
   * clientWidth - 100%
   * axisOffset - x
   */
  const axisOffsetInPercent = (axisOffset * 100) / clientWidth;
  const left = axisOffsetInPercent * (size - 1);

  return {
    left: `${10 + left}%`,
    width: `${80 - left}%`,
  };
};
