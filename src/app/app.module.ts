import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RawModule } from './raw/raw.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import * as firebase from 'firebase';

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDKg-DrORLEw5cYqk81T5FhyYn0KHjjtMA",
    authDomain: "nitms-84ab3.firebaseapp.com",
    databaseURL: "https://nitms-84ab3.firebaseio.com",
    projectId: "nitms-84ab3",
    storageBucket: "nitms-84ab3.appspot.com",
    messagingSenderId: "276244191720"
  };
  firebase.initializeApp(config);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RawModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
