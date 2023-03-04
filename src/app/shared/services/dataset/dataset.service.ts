import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  private data = null;

  getData(parameters) {
    if (!this.data) {
      this.fillData(parameters);
    }

    // return selected
    return this.data.filter((_, index) => parameters[index].selected);
  }

  private fillData(parameters) {
    const min = this.generateBetween(0, 500);
    const max = this.generateBetween(500, 1000);

    this.data = parameters.map(({ title }) => ({
      source: new Array(100).fill(null).map((_, index) => ({
        time: index * 100,
        [title]: this.generateBetween(min, max),
      })),
    }));
  }

  private generateBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
