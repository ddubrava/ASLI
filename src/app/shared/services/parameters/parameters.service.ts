import { Injectable } from '@angular/core';
import { debounceTime, Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { presetColors } from '../../const/preset-colors';
import { Parameter } from '../../types/parameter';

const PARAMETERS = [
  'КРЕпкв Угол крена',
  'ОМХпкв Угловая скорость',
  'КУРпкс Угол Курса',
  'ОМУпкв Угловая скорость',
  'ТАНпкв Угол Тангажа',
];

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  readonly parametersFormArray = this.initParameters();

  readonly parameters$ = this.parametersFormArray.valueChanges.pipe(
    debounceTime(100),
  ) as Observable<Parameter[]>;

  constructor(private fb: FormBuilder) {}

  private initParameters() {
    const array = PARAMETERS.map((title, index) => {
      const parameter: Parameter = {
        title,
        color: presetColors[index % presetColors.length],
        selected: false,
      };

      return this.fb.group(parameter);
    });

    return this.fb.array(array);
  }
}
