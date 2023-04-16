import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { StatisticsTableComponent } from './components/statistics-table/statistics-table.component';
import { MaterialModule } from '../../shared/material/material.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [StatisticsComponent, StatisticsTableComponent],
  imports: [CommonModule, MaterialModule, MatCardModule],
  exports: [StatisticsComponent],
})
export class StatisticsModule {}
