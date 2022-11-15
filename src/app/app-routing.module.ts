import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyConverterHomeComponent } from './currency-converter-home/currency-converter-home.component';

const routes: Routes = [{path:'home',component:CurrencyConverterHomeComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
