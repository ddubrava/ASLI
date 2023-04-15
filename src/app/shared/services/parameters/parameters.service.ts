import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { presetColors } from '../../const/preset-colors';
import { ParametersForm } from '../../types/parameters-form';
import { map, Observable, shareReplay } from 'rxjs';
import { Data } from '../../types/data';
import { ParametersByName } from '../../types/parameters-by-name';

/**
 * This service does not have the best architecture since it mixes sync and async code.
 * However, the problem is that the data is async, and also making parameters async is very complicated.
 * That's why we use clear and push to make parameters 'async' just to be responsive to changes.
 *
 * Another idea is to navigate to the Main module using resolvers,
 * but it requires a lot of hacks: such as refreshing the same navigation, creating logic for the resolver to work with the DataService,
 * and ensuring that the ParametersService is not a singleton.
 */
@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  parameters: FormArray<FormGroup<ParametersForm>> = new FormArray([]);

  selectedParameters$: Observable<ParametersByName> = this.parameters.valueChanges.pipe(
    map((changes) => changes.filter((parameter) => parameter.selected)),
    map((parameters) =>
      parameters.reduce<ParametersByName>((acc, v) => ({ ...acc, [v.name]: v }), {}),
    ),
    shareReplay(1),
  );

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.watchForAllDataChanges();
    this.watchForParametersChanges();
  }

  private watchForAllDataChanges() {
    this.dataService.allData$.subscribe((allData) => {
      this.parameters.clear();
      this.fillFormArray(allData);
    });
  }

  private watchForParametersChanges() {
    this.selectedParameters$.subscribe((parameters) => {
      const names = Object.keys(parameters);
      this.dataService.filterByKeys(names);
    });
  }

  private fillFormArray(allData: Data) {
    const parameters = Object.keys(allData);

    parameters.forEach((name, index) => {
      const group = this.formBuilder.group({
        name,
        color: presetColors[index % presetColors.length],
        selected: false,
      });

      this.parameters.push(group);
    });
  }
}
