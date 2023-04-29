import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { ParametersListComponent } from './components/parameters-list/parameters-list.component';
import { MaterialModule } from '../../../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidenavComponent, ParametersListComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [SidenavComponent],
})
export class SidenavModule {}
