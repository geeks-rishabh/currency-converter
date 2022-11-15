import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { threadId } from 'worker_threads';
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
  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      amount: new FormControl('1', [Validators.required]),
      from: new FormControl('EUR', [Validators.required]),
      to: new FormControl('USD', [Validators.required]),
    });

     this.fetchCurrencyList(); 
  }
  convertCurrency() {
    console.log(this.currencyForm.value);
    if (!this.currencyForm.valid) {
      return;
    }

    this.apiService.getExchangeRates(this.currencyForm.value).subscribe((res: any) => {
      this.currentValue = res.result;
      this.conversionRate = res.info.rate;
    });
  }

  fetchCurrencyList() {
    let symbols: string[] = [];
    let names: string[] = [];
    this.apiService.getCurrencyList().subscribe((res: any) => {
      // this.currencies = res.symbols;

      names = Object.values(res.symbols);
      symbols = Object.keys(res.symbols);
this.currencies = [];
console.log(names, symbols);
      for (let i = 0; i < names.length; i++) {
        console.log("inside", { name: names[i], symbol: symbols[i] });
        this.currencies.push({ name: names[i], symbol: symbols[i] });
     console.log(this.currencies); }
    });

  }


  f() {
    return this.currencyForm.value;
  }
}
