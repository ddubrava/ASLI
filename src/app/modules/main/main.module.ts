import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from './modules/chart/chart.module';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { MainComponent } from './main.component';
import { MaterialModule } from '../../shared/material/material.module';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, MainRoutingModule, MaterialModule, ChartModule, SidenavModule],
})
export class MainModule {}
