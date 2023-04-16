import { Injectable } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { Data } from '../../types/data';

const TIME_KEY = 'Time';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataInitiated = false;

  allData$ = new ReplaySubject<Data>(1);

  currentData$ = new ReplaySubject<Data>(1);

  init(records: Record<string, string>[]) {
    /**
     * Records are not sorted, sort them by time
     */
    records.sort((a, b) => this.parseTime(a[TIME_KEY]) - this.parseTime(b[TIME_KEY]));

    const data: Data = {};

    for (const record of records) {
      for (const [name, value] of Object.entries(record)) {
        if (!data[name]) {
          data[name] = [];
        }

        /**
         * Filter NaN values
         */
        const parsedValue = parseFloat(value.replace(/,/g, '.'));

        if (isNaN(parsedValue)) {
          continue;
        }

        data[name].push({
          x: this.parseTime(record[TIME_KEY]),
          y: parsedValue,
          name,
        });
      }
    }

    this.allData$.next(data);
    this.dataInitiated = true;
  }

  filterByKeys(keys: string[]) {
    const mustBeSaved = new Set([...keys]);

    this.allData$.pipe(take(1)).subscribe((allData) => {
      this.currentData$.next(
        Object.fromEntries(Object.entries(allData).filter(([key]) => mustBeSaved.has(key))),
      );
    });
  }

  /**
   * Parses hh:mm:ss,sss pattern and returns getTime() (milliseconds)
   */
  private parseTime(timeString: string): number {
    const [time, milliseconds] = timeString.split(',');
    const [hours, minutes, seconds] = time.split(':');

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(Number(seconds));
    date.setMilliseconds(Number(milliseconds));

    return date.getTime();
  }
}
