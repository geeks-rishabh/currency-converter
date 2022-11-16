import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

    // this.fetchCurrencyList();
    this.convertCurrency();
  }
  convertCurrency() {
    console.log(this.currencyForm.value);
    if (!this.currencyForm.valid) {
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
       // this.apiService.getExchangeRates(this.currencyForm.value).subscribe((res: any) => {
    // });
  }

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
      "base": "USD",
      "date": "2022-04-14",
      "rates": {
        "EUR": 0.813399,
        "GBP": 0.72007,
        "JPY": 107.346001,
        "NZR": 10.346001,
        "AUD": 78.3001,
        "CAD": 21.30,
        "HKD": 2.30,
        "CHF": 4.30,
        "CNH": 24.30,
        "USD": 80.30,
        "INR": 0.30,
      },
      "success": true,
      "timestamp": 1519296206
    }
    let symbols: string[] = [];
    let rates: number[] = [];
    symbols = Object.keys(res.rates);
    rates = Object.values(res.rates);

    // this.currencies = [];

    for (let i = 0; i < symbols.length; i++) {

      if ((this.currencyForm.value.to ===symbols[i]) || (this.currencyForm.value.from ===symbols[i])) {

      } else { this.latestRates.push({ rate: rates[i], symbol: symbols[i] }); }
    }

    // this.apiService.getLatestConversionRate().subscribe((res: any) => {


    //   console.log(res);

    // });

  }


  f() {
    return this.currencyForm.value;
  }
}
