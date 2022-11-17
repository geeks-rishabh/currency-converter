import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyDetailComponent } from './currency-detail/currency-detail.component';
import { CurrencyConverterHomeComponent } from './currency-converter-home/currency-converter-home.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { HeaderComponent } from './header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyDetailComponent,
    CurrencyConverterHomeComponent,
    HeaderComponent,
    CurrencyConverterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
