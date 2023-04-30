import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataZoomService {
  readonly dataZoom$ = new BehaviorSubject<[number, number] | []>([]);
}
