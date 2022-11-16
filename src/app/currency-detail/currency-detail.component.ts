import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';

import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-currency-detail',
  templateUrl: './currency-detail.component.html',
  styleUrls: ['./currency-detail.component.scss']
})
export class CurrencyDetailComponent implements OnInit {
  currencyForm!: FormGroup;
  currentValue: string = "";
  conversionRate = "";
  currencies: any[] = [];
  latestRates: any[] = [];
  historicalData: any = {};
  public lineChartData!: ChartConfiguration<'line'>['data'];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
  chart: boolean = false;
  to="";
  from="";
  amount="";
errorTxt='';
  constructor(private router:Router,private route:ActivatedRoute,  private apiService: ApiService) { }

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
    
    this.route.params.subscribe(params => {
      console.log(params);
      this.to = params['to'];
      this.from = params['from'];
      this.amount = params['amount'];
      this.currencyForm.patchValue({to:this.to, from:this.from, amount: this.amount});
      
  });
    this.convertCurrency();
    this.fetchHistoricData();
  }
  convertCurrency() {
    if (!this.currencyForm.valid) {
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
    this.apiService.getCurrencyList().subscribe((res: any) => {
      this.fetchLatestConversionRates();
      names = Object.values(res.symbols);
      symbols = Object.keys(res.symbols);
      this.currencies = [];

      for (let i = 0; i < names.length; i++) {
        this.currencies.push({ name: names[i], symbol: symbols[i] });
      }
      this.currencyForm.patchValue({to:this.to, from:this.from, amount: this.amount});
    });
  }
  fetchLatestConversionRates() {
    this.apiService.getLatestConversionRate('USD,EUR,GBP,JPY,AUD,CAD,CHF,CNH,HKD,NZD,AED', this.currencyForm.value.from).subscribe((res: any) => {
      console.log(res);
      let symbols: string[] = [];
      let rates: number[] = [];
      symbols = Object.keys(res.rates);
      rates = Object.values(res.rates);
      for (let i = 0; i < symbols.length; i++) {
        if ((this.currencyForm.value.to === symbols[i]) || (this.currencyForm.value.from === symbols[i])) {
        } else { this.latestRates.push({ rate: rates[i], symbol: symbols[i] }); }
      }
    });
  }

  fetchHistoricData() {
    this.apiService.getHistoricalData(this.currencyForm.value.from,this.currencyForm.value.to).subscribe((response:any)=>{
      this.historicalData = response.rates;
      let labels: string[] = [];
      let values: number[] = [];
      Object.values(response.rates).forEach((item:any) => {
        let record:any = Object.values(item);
        values.push(record[0]);
        console.log(record[0]);
      })
  
      this.lineChartData = {
        labels: Object.keys(response.rates),
        datasets: [
          {
            data: values,
            label: 'Historical Rates Chart',
            fill: true,
            tension: 0.5,
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)'
          }
        ]
      };
      this.chart = true;
  
    });
  }
}
