import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, map, Observable, startWith, Subject } from 'rxjs';
import { presetColors } from '../../../../../../shared/const/preset-colors';
import { ParametersService } from '../../../../../../shared/services/parameters/parameters.service';
import { ParametersForm } from '../../../../../../shared/types/parameters-form';

@Component({
  selector: 'app-parameters-list',
  templateUrl: './parameters-list.component.html',
  styleUrls: ['./parameters-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersListComponent implements OnDestroy {
  @Input() showOnlySelected = false;

  @Input() showSearch = false;

  destroy$ = new Subject<void>();

  presetColors = presetColors;

  searchFormControl = new FormControl();

  controls$: Observable<FormGroup<ParametersForm>[]> = combineLatest([
    this.parametersFormArray.valueChanges.pipe(startWith(null)),
    this.searchFormControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([, searchValue]) => {
      const controls = this.parametersFormArray.controls;

      if (this.showOnlySelected) {
        return controls.filter((control) => control.value.selected);
      }

      if (searchValue) {
        searchValue = searchValue.toLowerCase();

        return controls.filter((control) => {
          const name = control.value.name.toLowerCase();
          return name.includes(searchValue);
        });
      }

      return controls;
    }),
    startWith(this.parametersFormArray.controls),
  );

  constructor(private parametersService: ParametersService) {}

  get parametersFormArray() {
    return this.parametersService.parameters;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
