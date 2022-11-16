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
  currencies: any[] =[];
  latestRates: any[] = [];
  errorTxt:string ='';
  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      amount: new FormControl(1, [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      from: new FormControl('EUR', [Validators.required]),
      to: new FormControl('USD', [Validators.required]),
    });

    this.currencyForm.valueChanges
      .subscribe((params:any) => {
        console.log(params);
        this.currentValue ='';
        this.errorTxt = '';
        if(params.to===params.from){
          this.errorTxt = "From and To currency should not be same";
        }
      });
    this.fetchCurrencyList();
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
    this.apiService.getExchangeRates(this.currencyForm.value).subscribe((res: any) => {
      this.currentValue = "" + res.result;
      this.conversionRate = "" + res.info.rate;
      this.fetchLatestConversionRates();
    });
  }

  fetchCurrencyList() {
    let symbols: string[] = [];
    let names: string[] = [];
    this.currencies = [];
    this.apiService.getCurrencyList().subscribe((res: any) => {
      this.fetchLatestConversionRates();
      names = Object.values(res.symbols);
      symbols = Object.keys(res.symbols);
      this.currencies = [];

      for (let i = 0; i < names.length; i++) {
        this.currencies.push({ name: names[i], symbol: symbols[i] });
      }

      this.currencyForm.patchValue({to:'EUR', from:'USD'});
    });
  }
  fetchLatestConversionRates() {
    this.apiService.getLatestConversionRate("USD,EUR,GBP,JPY,AUD,CAD,CHF,CNH,HKD,NZD,AED", this.currencyForm.value.from).subscribe((res: any) => {
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
  }

}
