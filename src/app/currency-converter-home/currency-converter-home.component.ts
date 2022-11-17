import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pairwise, withLatestFrom } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
const CURRENCY_AMOUNT = '1'
const CURRENCY_FROM = 'EUR'
const CURRENCY_TO = 'USD'
@Component({
  selector: 'app-currency-converter-home',
  templateUrl: './currency-converter-home.component.html',
  styleUrls: ['./currency-converter-home.component.scss']
})
export class CurrencyConverterHomeComponent implements OnInit {
  currencyForm!: FormGroup;
  currentValue: string = "";
  conversionRate = "";
  // currencies: Currency[] = [];
  
  currencies: Currency[] = [{ name: 'United States Dollar', symbol: 'USD' }, { name: 'Great Britain Pound', symbol: 'GBP' }, { name: 'Euro', symbol: 'EUR' }];
  latestRates: Rates[] = [];
  errorTxt: string = '';
  
  @Input() home:boolean = true; 
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      amount: new FormControl(CURRENCY_AMOUNT, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      from: new FormControl(CURRENCY_FROM, [Validators.required]),
      to: new FormControl(CURRENCY_TO, [Validators.required]),
    });

    this.currencyForm.valueChanges
      .subscribe((params: FormValues) => {
        this.currentValue = '';
        this.errorTxt = '';
        if (params.to === params.from) {
          this.errorTxt = "From and To currency should not be same";
        }
      });
    // this.fetchCurrencyList();
  }
  convertCurrency() {
    this.currentValue = '';
    console.log(this.currencyForm.value);
    if (!this.currencyForm.valid) {
      return;
    }

    if (this.currencyForm.value.to === this.currencyForm.value.from) {
      return;
    }

    const conversionResponse = {
      "date": "2018-02-22",
      "historical": "",
      "info": {
        "rate": 148.972231,
        "timestamp": 1519328414
      },
      "query": {
        "amount": 25,
        "from": "GBP",
        "to": "JPY"
      },
      "result": 3724.305775,
      "success": true
    }
    this.currentValue = "" + conversionResponse.result;
    this.conversionRate = "" + conversionResponse.info.rate;
    this.fetchLatestConversionRates();
      // this.apiService.getExchangeRates(this.currencyForm.value).subscribe((res: ConversionResponse) => {
    //   this.currentValue = "" + res.result;
    //   this.conversionRate = "" + res.info.rate;
    //   this.fetchLatestConversionRates();
    // });
  }

  fetchCurrencyList() {
    let symbols: string[] = [];
    let names: string[] = [];
    this.currencies = [];
    this.apiService.getCurrencyList().subscribe((res: CurrencyResponse) => {
      this.fetchLatestConversionRates();
      names = Object.values(res.symbols);
      symbols = Object.keys(res.symbols);
      this.currencies = [];

      for (let i = 0; i < names.length; i++) {
        this.currencies.push({ name: names[i], symbol: symbols[i] });
      }

      this.currencyForm.patchValue({ to: 'EUR', from: 'USD' });
    });
  }
  fetchLatestConversionRates() {
console.log("here");
    const res = {
      "base": "EUR",
      "date": "2022-04-14",
      "rates": {
        "AUD": 1.533492,
        "CAD": 1.376816,
        "CHF": 0.978849,
        "EUR": 1,
        "GBP": 0.874101,
        "HKD": 8.120701,
        "JPY": 145.089016,
        "NZD": 1.684334,
        "USD": 1.037829,
        "INR": 0.634,
        "AED": 1.0829
      },
      "success": true,
      "timestamp": 1519296206
    }
    let symbols: string[] = [];
    let rates: number[] = [];
    symbols = Object.keys(res.rates);
    rates = Object.values(res.rates);
this.latestRates= [];
    for (let i = 0; i < symbols.length; i++) {

      if ((this.currencyForm.value.to === symbols[i]) || (this.currencyForm.value.from === symbols[i])) {

      } else { this.latestRates.push({ rate: rates[i], symbol: symbols[i] }); }
    }/*
    this.apiService.getLatestConversionRate("USD,EUR,GBP,JPY,AUD,CAD,CHF,CNH,HKD,NZD,AED", this.currencyForm.value.from).subscribe((res: LatestConversionRatesResponse) => {
      console.log(res);
      let symbols: string[] = [];
      let rates: number[] = [];
      symbols = Object.keys(res.rates);
      rates = Object.values(res.rates);

      for (let i = 0; i < symbols.length; i++) {

        if ((this.currencyForm.value.to === symbols[i]) || (this.currencyForm.value.from === symbols[i])) {

        } else { this.latestRates.push({ rate: rates[i], symbol: symbols[i] }); }
      }
      this.latestRates.length = 9;
    });
  */ }

  swap(){
    this.currencyForm.patchValue({from:this.currencyForm.value.to,to:this.currencyForm.value.from});
  }

}

export interface FormValues{
  amount:number,
  from:string,
  to:string
}
export interface CurrencyResponse {
  success:boolean,
  symbols:Currency
}

export interface Currency {
  name:string,
  symbol:string
}


export interface Rates {
  rate:number,
  symbol:string
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
    timestamp:number
  }
  export interface ConversionInfoQuery {
    "amount": number,
    "from": string,
    "to": string
  }


  export interface LatestConversionRatesResponse
  {
    "base": string,
    "date": string,
    "rates": Currency,
    "success": boolean,
    "timestamp": number
  }