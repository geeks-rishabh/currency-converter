import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pairwise } from 'rxjs';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-currency-converter-home',
  templateUrl: './currency-converter-home.component.html',
  styleUrls: ['./currency-converter-home.component.scss']
})
export class CurrencyConverterHomeComponent implements OnInit {
  currencyForm!: FormGroup;
  currentValue: string = "";
  conversionRate = "";
  currencies: any[] = [{ name: 'United States Dollar', symbol: 'USD' }, { name: 'Great Britain Pound', symbol: 'GBP' }, { name: 'Euro', symbol: 'EUR' }];
  latestRates: any[] = [];
  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      amount: new FormControl('1', [Validators.required]),
      from: new FormControl('EUR', [Validators.required]),
      to: new FormControl('USD', [Validators.required]),
    });

    this.currencyForm.valueChanges
      .subscribe((value:any) => {
        console.log(value);
      });
    this.fetchCurrencyList();
    this.convertCurrency();
  }
  convertCurrency() {
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
       /* this.apiService.getExchangeRates(this.currencyForm.value).subscribe((res: any) => {
         this.currentValue = "" + conversionResponse.result;
    this.conversionRate = "" + conversionResponse.info.rate;
   });
  */}

  fetchCurrencyList() {
    let symbols: string[] = [];
    let names: string[] = [];
    this.apiService.getCurrencyList().subscribe((res: any) => {
      // this.currencies = res.symbols;
      this.fetchLatestConversionRates();
      names = Object.values(res.symbols);
      symbols = Object.keys(res.symbols);
      this.currencies = [];

      for (let i = 0; i < names.length; i++) {
        this.currencies.push({ name: names[i], symbol: symbols[i] });
      }
    });
  }
  fetchLatestConversionRates() {
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
        "USD": 1.037829
      },
      "success": true,
      "timestamp": 1519296206
    }
    let symbols: string[] = [];
    let rates: number[] = [];
    symbols = Object.keys(res.rates);
    rates = Object.values(res.rates);

    for (let i = 0; i < symbols.length; i++) {

      if ((this.currencyForm.value.to === symbols[i]) || (this.currencyForm.value.from === symbols[i])) {

      } else { this.latestRates.push({ rate: rates[i], symbol: symbols[i] }); }
    }
    /* this.apiService.getLatestConversionRate().subscribe((res: any) => {
       console.log(res);
    let symbols: string[] = [];
    let rates: number[] = [];
    symbols = Object.keys(res.rates);
    rates = Object.values(res.rates);

    for (let i = 0; i < symbols.length; i++) {

      if ((this.currencyForm.value.to ===symbols[i]) || (this.currencyForm.value.from ===symbols[i])) {

      } else { this.latestRates.push({ rate: rates[i], symbol: symbols[i] }); }
    }

   });
*/
  }


  f() {
    return this.currencyForm.value;
  }
}
