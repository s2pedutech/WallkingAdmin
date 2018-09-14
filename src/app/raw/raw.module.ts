import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawDashboardComponent } from './raw-dashboard/raw-dashboard.component';
import { NavModule } from '../nav/nav.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    NavModule,
    FormsModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule,
    HttpClientModule
  ],
  declarations: [RawDashboardComponent],
  exports: [RawDashboardComponent]
})
export class RawModule { }
