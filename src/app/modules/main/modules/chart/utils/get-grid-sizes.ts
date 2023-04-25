import { GridSize } from '../types/grid-size';

export const getGridSizes = (size: number): GridSize[] => {
  const grid = new Array(size);

  for (let i = 0; i < size; i++) {
    grid[i] = {
      top: `${(100 / size) * i + 6.5}%`,
      height: `${100 / size - 15}%`,
    };
  }

  return grid;
};
