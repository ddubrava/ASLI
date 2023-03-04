import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Options } from '../../types/options';
import { defaultOptions } from '../../const/default-options';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  readonly options$ = new BehaviorSubject<Options>(defaultOptions);
}
