import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { presetColors } from '../../../../../../shared/const/preset-colors';
import { ParametersService } from '../../../../../../shared/services/parameters/parameters.service';
import { ParametersForm } from '../../../../../../shared/types/parameters-form';

const MAX_SELECTED_NUMBER = 5;

@Component({
  selector: 'app-parameters-list',
  templateUrl: './parameters-list.component.html',
  styleUrls: ['./parameters-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersListComponent implements OnInit, OnDestroy {
  @Input() showOnlySelected = false;

  @HostBinding('class.parameters-viewport_with-search')
  @Input()
  showSearch = false;

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

  ngOnInit() {
    this.watchForParametersChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private watchForParametersChanges() {
    this.parametersService.parameters.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.toggleParameters();
    });
  }

  /**
   * Enables/disables parameters checkboxes based on MAX_SELECTED_NUMBER.
   * The logic is not efficient, since we already traverse over parameters in controls$.
   * But parameters array is small (~1k), so all this stuff is pretty fast.
   */
  private toggleParameters() {
    const selected = this.parametersFormArray.controls.reduce(
      (acc, v) => acc + Number(v.value.selected),
      0,
    );

    this.parametersFormArray.controls.forEach((control) => {
      /**
       * We need to enable controls whenever selected < MAX_SELECTED_NUMBER,
       * but technically we care only about MAX_SELECTED_NUMBER - 1.
       * Assume we have 3/3, all controls are disabled.
       * To enable them we should have 2/3 => MAX_SELECTED_NUMBER - 1.
       */
      if (selected === MAX_SELECTED_NUMBER - 1) {
        control.enable({ emitEvent: false });
      } else if (selected === MAX_SELECTED_NUMBER && !control.value.selected) {
        control.disable({ emitEvent: false });
      }
    });
  }
}
