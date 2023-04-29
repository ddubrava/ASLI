import { CHART_ID } from '../const/chart-id';
import * as echarts from 'echarts';

/**
 * Calculates grid top and grid height, so they are evenly distributed.
 *
 * @param size number of grids
 */
export const getGridTopAndHeightValues = (
  size: number,
): Pick<echarts.GridComponentOption, 'top' | 'height'>[] => {
  /**
   * Height of a data zoom.
   */
  const dataZoomHeight = 70;

  /**
   * If we set top 0, the first plot is out of a viewport,
   * so we add this base/default padding.
   */
  const baseTopPadding = 60;

  /**
   * The padding between plots.
   */
  const padding = 80;

  /**
   * We use chart height instead of percents not to convert absolute numbers to percents,
   * such as data zoom height, top padding, padding.
   */
  const totalHeight =
    document.querySelector(`#${CHART_ID}`).clientHeight - dataZoomHeight - baseTopPadding;

  const gridHeight = (totalHeight - padding * (size - 1)) / size;

  const gridSizes = [];

  for (let i = 0; i < size; i++) {
    const top = i * (gridHeight + padding) + baseTopPadding;

    gridSizes.push({
      top: `${top}`,
      height: `${gridHeight}`,
    });
  }

  return gridSizes;
};
