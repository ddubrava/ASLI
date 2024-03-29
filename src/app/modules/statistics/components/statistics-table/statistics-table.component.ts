import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StatisticsElement } from './types/statistics-element';
import { MatTable } from '@angular/material/table';
import { combineLatest, debounceTime, Subject, takeUntil } from 'rxjs';
import { DataService } from '../../../../shared/services/data/data.service';
import { ParametersService } from '../../../../shared/services/parameters/parameters.service';
import { DataZoomService } from '../../../../shared/services/data-zoom/data-zoom.service';
import { DataSource } from '../../../../shared/types/data-source';

@Component({
  selector: 'app-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<StatisticsElement>;

  displayedColumns = [
    'color',
    'parameterName',
    'minimum',
    'maximum',
    'average',
    'expectedValue',
    'variance',
    'sigma',
    'unit',
  ];

  dataSource$: Subject<StatisticsElement[]> = new Subject();

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private parametersService: ParametersService,
    private dataZoomService: DataZoomService,
  ) {}

  ngOnInit() {
    this.watchForDataAndParametersChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private watchForDataAndParametersChanges() {
    combineLatest([
      this.dataService.currentData$,
      this.parametersService.selectedParameters$,
      this.dataZoomService.dataZoom$,
    ])
      .pipe(
        /**
         * When currentData & selectedParameters$ are changed at the same time
         */
        debounceTime(0),
        takeUntil(this.destroy$),
      )
      .subscribe(([data, parameters, dataZoom]) => {
        const dataSource: StatisticsElement[] = Object.values(data).map((source) => {
          const values = this.filterDataByZoom(source, dataZoom);

          const parameterName = source[0].name;
          const parameter = parameters[parameterName];

          const [parameterNameWithoutUnit, parameterUnit] = parameterName.split(', ');

          const expectedValue = this.getExpectedValue(values);
          const variance = this.getVariance(values, expectedValue);

          return {
            color: parameter.color,
            parameterName: parameterNameWithoutUnit,
            minimum: this.getMin(values),
            maximum: this.getMax(values),
            average: this.getAverage(values),
            expectedValue,
            variance,
            sigma: this.getSigma(variance),
            unit: parameterUnit || '',
          };
        });

        this.dataSource$.next(dataSource);
      });
  }

  private filterDataByZoom(source: DataSource[], dataZoom: [number, number] | []): number[] {
    const [dataZoomStartValue, dataZoomEndValue] = dataZoom;

    return source.reduce<number[]>((acc, value) => {
      const { x, y } = value;

      /**
       * If data zoom values are undefined, zoom is 0-100%.
       */
      if (!dataZoomStartValue || !dataZoomEndValue) {
        return [...acc, y];
      }

      if (x >= dataZoomStartValue && x <= dataZoomEndValue) {
        return [...acc, y];
      }

      return acc;
    }, []);
  }

  private getMin(data: number[]) {
    return Math.min(...data);
  }

  private getMax(data: number[]) {
    return Math.max(...data);
  }

  private getAverage(data: number[]): number {
    const sum = data.reduce((acc, v) => acc + v, 0);

    return sum / data.length;
  }

  /**
   * E(X) = Σ [x * p(x)],
   *
   * In the case of a discrete random variable like X,
   * where the possible values of X are finite and discrete,
   * we can estimate the expected value as:
   *
   * E(X) = Σ [x_i * (1/N)]
   */
  private getExpectedValue(data: number[]): number {
    return data.reduce((acc, v) => acc + v / data.length, 0);
  }

  /**
   * Var(X) = E[(X - E(X))^2]
   *
   * For a finite set of observations of X, we can estimate the variance as:
   *
   * Var(X) = Σ [(x_i - E(X))^2 * (1/N)]
   */
  private getVariance(data: number[], expectedValue: number): number {
    return data.reduce((acc, v) => acc + (v - expectedValue) ** 2, 0) / data.length;
  }

  private getSigma(variance): number {
    return Math.sqrt(variance);
  }
}
