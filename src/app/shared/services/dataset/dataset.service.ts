import { Injectable } from '@angular/core';
import { Parameter } from '../../types/parameter';
import { Data } from '../../types/data';
import { DataZoom } from '../../types/data-zoom';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  private data: Data[] | null = null;

  /**
   * @todo I think this service shouldn't know anything about parameters
   */
  getData(parameters: Parameter[], dataZoom?: DataZoom): Data[] {
    if (!this.data) {
      this.fillData(parameters);
    }

    const selectedData = this.data.filter((d) =>
      parameters.find((p) => p.selected && p.title === d.source[0].name),
    );

    if (!dataZoom) {
      return selectedData;
    }

    return selectedData.map(({ source }) => ({
      source: source.reduce((acc, v) => {
        /**
         * @todo figure out if * 100 works
         */
        if (v.x < dataZoom.startValue * 100 || v.x > dataZoom.endValue * 100) {
          return acc;
        }

        return [...acc, v];
      }, []),
    }));
  }

  private fillData(parameters: Parameter[]) {
    const min = this.generateBetween(0, 500);
    const max = this.generateBetween(500, 1000);

    this.data = parameters.map(({ title }) => ({
      source: new Array(100).fill(null).map((_, index) => ({
        /**
         * Order is important.
         */
        x: index * 100,
        y: this.generateBetween(min, max),
        name: title,
      })),
    }));
  }

  private generateBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
