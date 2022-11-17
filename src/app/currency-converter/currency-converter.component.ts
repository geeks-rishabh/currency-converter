import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit {

  currencyForm!: FormGroup;
  currentValue: string = "";
  conversionRate = "";

  currencies: Currency[] = [{ name: 'United States Dollar', symbol: 'USD' }, { name: 'Great Britain Pound', symbol: 'GBP' }, { name: 'Euro', symbol: 'EUR' }];
  latestRates: Rates[] = [];
  errorTxt: string = '';

  @Input() isHome: boolean = false;
  @Input() amount: number = 0;
  @Input() currencyFrom: string = '';
  @Input() currencyTo: string = '';
  @Output() update = new EventEmitter();
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      amount: new FormControl(this.amount, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      from: new FormControl(this.currencyFrom, [Validators.required]),
      to: new FormControl(this.currencyTo, [Validators.required]),
    });

    this.currencyForm.valueChanges
      .subscribe((params: FormValues) => {
        this.currentValue = '';
        this.errorTxt = '';
        if (params.to === params.from) {
          this.errorTxt = "From and To currency should not be same";
        }
      });
    this.fetchCurrencyList();
  }
  convertCurrency() {
    this.currentValue = '';
    if (!this.currencyForm.valid) {
      return;
    }

    if (this.currencyForm.value.to === this.currencyForm.value.from) {
      return;
    }

    this.apiService.getExchangeRates(this.currencyForm.value).subscribe((res: ConversionResponse) => {
      this.currentValue = "" + res.result;
      this.conversionRate = "" + res.info.rate;
      this.isHome ? this.update.emit(this.currencyForm.value) : this.update.emit('chart');

    });
  }

  fetchCurrencyList() {
    let symbols: string[] = [];
    let names: string[] = [];
    this.currencies = [];
    this.apiService.getCurrencyList().subscribe((res: CurrencyResponse) => {
      names = Object.values(res.symbols);
      symbols = Object.keys(res.symbols);
      this.currencies = [];

      for (let i = 0; i < names.length; i++) {
        this.currencies.push({ name: names[i], symbol: symbols[i] });
      }
      this.currencyForm.patchValue({ to: 'EUR', from: 'USD' });
    });
  }

  swap() {
    this.currencyForm.patchValue({ from: this.currencyForm.value.to, to: this.currencyForm.value.from });
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