import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RawModule } from './raw/raw.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RawModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
