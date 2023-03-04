import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataZoom } from '../../types/data-zoom';

@Injectable({
  providedIn: 'root',
})
export class DataZoomService {
  readonly dataZoom$ = new BehaviorSubject<DataZoom | null>(null);
}
