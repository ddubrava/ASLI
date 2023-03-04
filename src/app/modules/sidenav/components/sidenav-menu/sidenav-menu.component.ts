import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { OptionsService } from '../../../../shared/services/options/options.service';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Options } from '../../../../shared/types/options';
import { defaultOptions } from '../../../../shared/const/default-options';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavMenuComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  menuFormGroup = this.fb.group({
    ...defaultOptions,
  });

  constructor(private optionsService: OptionsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.onMenuGroupChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuGroupChanges() {
    this.menuFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes: Options) => {
      this.optionsService.options$.next(changes);
    });
  }
}
