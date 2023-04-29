import { Injectable } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { Data } from '../../types/data';
import { convertTimeToTimestamp } from '../../utils/convert-data-to-timestamp';

const TIME_KEY = 'Time';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataInitiated = false;

  allData$ = new ReplaySubject<Data>(1);

  currentData$ = new ReplaySubject<Data>(1);

  init(records: Record<string, string>[]) {
    const data: Data = {};

    for (const record of records) {
      for (const [name, value] of Object.entries(record)) {
        /**
         * __parsed_extra contains an array of all data parsed from that row that extended beyond the header row.
         * So we should skip the property, since we do not care about this.
         *
         * @see https://www.papaparse.com/docs
         */
        if (name === '__parsed_extra') {
          continue;
        }

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
          x: convertTimeToTimestamp(record[TIME_KEY]),
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
}
