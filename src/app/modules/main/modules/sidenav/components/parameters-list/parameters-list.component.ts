import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith, Subject } from 'rxjs';
import { presetColors } from '../../../../../../shared/const/preset-colors';
import { ParametersService } from '../../../../../../shared/services/parameters/parameters.service';

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
        const name = control.value.name.toLowerCase();

        return name.includes(search);
      });
    }),
    map((controls) =>
      this.showOnlySelected ? controls.filter((control) => control.value.selected) : controls,
    ),
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
