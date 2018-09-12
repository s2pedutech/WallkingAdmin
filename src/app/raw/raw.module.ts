import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawDashboardComponent } from './raw-dashboard/raw-dashboard.component';
import { NavModule } from '../nav/nav.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NavModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [RawDashboardComponent],
  exports: [RawDashboardComponent]
})
export class RawModule { }
