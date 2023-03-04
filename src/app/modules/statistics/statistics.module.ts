import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsTableComponent } from './components/statistics-table/statistics-table.component';
import { MaterialModule } from '../../shared/material/material.module';

@NgModule({
  declarations: [StatisticsComponent, StatisticsTableComponent],
  imports: [CommonModule, MaterialModule, StatisticsRoutingModule],
})
export class StatisticsModule {}
