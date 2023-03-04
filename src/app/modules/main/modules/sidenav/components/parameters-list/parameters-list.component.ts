import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { combineLatest, map, startWith, Subject } from 'rxjs';
import { ParametersService } from '../../../../../../shared/services/parameters/parameters.service';
import { presetColors } from '../../../../../../shared/const/preset-colors';

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

  controls$ = combineLatest([
    this.parametersFormArray.valueChanges.pipe(startWith(this.parametersFormArray.controls)),
    this.searchFormControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([, searchValue]) => {
      const controls = this.parametersFormArray.controls;

      if (!searchValue) {
        return controls;
      }

      return controls.filter((control) => {
        const search = searchValue.toLowerCase();
        const title = control.value.title.toLowerCase();

        return title.includes(search);
      });
    }),
    map((controls) =>
      this.showOnlySelected ? controls.filter((control) => control.value.selected) : controls,
    ),
  );

  constructor(private fb: FormBuilder, private parametersService: ParametersService) {}

  get parametersFormArray() {
    return this.parametersService.parametersFormArray;
  }

  get canSelect(): boolean {
    return this.parametersFormArray.controls.filter((control) => control.value.selected).length < 3;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
