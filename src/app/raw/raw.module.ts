import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawDashboardComponent } from './raw-dashboard/raw-dashboard.component';
import { NavModule } from '../nav/nav.module';

@NgModule({
  imports: [
    CommonModule,
    NavModule
  ],
  declarations: [RawDashboardComponent],
  exports: [RawDashboardComponent]
})
export class RawModule { }
