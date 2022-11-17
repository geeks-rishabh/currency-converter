import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pairwise, withLatestFrom } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
const POPULAR_CURRENCY_LIST = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "INR", "HKD", "NZD", "AED"];
@Component({
  selector: 'app-currency-converter-home',
  templateUrl: './currency-converter-home.component.html',
  styleUrls: ['./currency-converter-home.component.scss']
})
export class CurrencyConverterHomeComponent {
  currencyForm!: FormGroup;
  currentValue: string = "";
  conversionRate = "";
  currencies: Currency[] = [];
  latestRates: Rates[] = [];
  errorTxt: string = '';

  @Input() home: boolean = true;
  conversionData!: ParamsInput;
  constructor(private apiService: ApiService) { }

  fetchLatestConversionRates(params: ParamsInput) {
    
    this.conversionData = params;
    this.apiService.getLatestConversionRate(POPULAR_CURRENCY_LIST.filter(c=>c!=params.from && c!=params.to).join(','), params.from).subscribe((res: LatestConversionRatesResponse) => {
      let symbols: string[] = [];
      let rates: number[] = [];
      this.latestRates = [];
      symbols = Object.keys(res.rates);
      rates = Object.values(res.rates);
      for (let i = 0; i < symbols.length; i++) {
        if ((params.to === symbols[i]) || (params.from === symbols[i])) {
        } else {  this.latestRates.push({ rate: rates[i], symbol: symbols[i] });  }
      }

      this.currencyForm.patchValue({ to: 'EUR', from: 'USD' });
    });
  }

}

export interface FormValues {
  amount: number,
  from: string,
  to: string
}
export interface CurrencyResponse {
  success: boolean,
  symbols: Currency
}

export interface Currency {
  name: string,
  symbol: string
}


export interface Rates {
  rate: number,
  symbol: string
}

export interface ConversionResponse {

  date: string,
  historical: string,
  info: ConversionInfoObject,
  query: ConversionInfoQuery,
  result: number,
  success: boolean
}

export interface ConversionInfoObject {
  rate: number,
  timestamp: number
}
export interface ConversionInfoQuery {
  "amount": number,
  "from": string,
  "to": string
}


export interface LatestConversionRatesResponse {
  "base": string,
  "date": string,
  "rates": Currency,
  "success": boolean,
  "timestamp": number
}

export interface ParamsInput {
  amount: number,
  from: string,
  to: string
}
