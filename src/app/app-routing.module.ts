import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyConverterHomeComponent } from './currency-converter-home/currency-converter-home.component';
import { CurrencyDetailComponent } from './currency-detail/currency-detail.component';

const routes: Routes = [{ path: '', component: CurrencyConverterHomeComponent }, { path: 'details/:from/:to/:amount', component: CurrencyDetailComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
