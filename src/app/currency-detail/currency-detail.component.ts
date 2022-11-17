import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';

import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { ActivatedRoute, Router } from '@angular/router';
import { ConversionResponse, Currency, CurrencyResponse, FormValues } from '../currency-converter-home/currency-converter-home.component';
const _ = require('lodash');
@Component({
  selector: 'app-currency-detail',
  templateUrl: './currency-detail.component.html',
  styleUrls: ['./currency-detail.component.scss']
})
export class CurrencyDetailComponent implements OnInit {
  currencyForm!: FormGroup;
  currentValue: string = "";
  conversionRate = "";
  // currencies: Currency[] = [];

  currencies: Currency[] = [{ name: 'United States Dollar', symbol: 'USD' }, { name: 'Great Britain Pound', symbol: 'GBP' }, { name: 'Euro', symbol: 'EUR' }];

  historicalData: any = {
    "base": "EUR",
    "end_date": "2012-05-03",
    "rates": {
      "2012-05-01": {
        "AUD": 1.278047,
        "CAD": 1.302303,
        "USD": 1.322891
      },
      "2012-05-02": {
        "AUD": 1.274202,
        "CAD": 1.299083,
        "USD": 1.315066
      },
      "2012-05-03": {
        "AUD": 1.280135,
        "CAD": 1.296868,
        "USD": 1.314491
      }
    },
    "start_date": "2012-05-01",
    "success": true,
    "timeseries": true
  };
  public lineChartData!: ChartConfiguration<'line'>['data'];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
  chart: boolean = false;
  to: string = "";
  from: string = "";
  amount: number = 0;
  errorTxt = '';
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.to = params['to'];
      this.from = params['from'];
      this.amount = params['amount'];
      this.currencyForm.patchValue({ to: this.to, from: this.from, amount: this.amount });
    });
    this.convertCurrency();

    // this.fetchHistoricData();
  }
  convertCurrency() {
    if (!this.currencyForm.valid) {
      return;
    }
    this.fetchHistoricData(); this.apiService.getExchangeRates(this.currencyForm.value).subscribe((res: ConversionResponse) => {
      this.currentValue = "" + res.result;
      this.conversionRate = "" + res.info.rate;
      this.fetchHistoricData();
    });
  }

  fetchCurrencyList() {
    let symbols: string[] = [];
    let names: string[] = [];
    this.apiService.getCurrencyList().subscribe((res: CurrencyResponse) => {
      names = Object.values(res.symbols);
      symbols = Object.keys(res.symbols);
      this.currencies = [];

      for (let i = 0; i < names.length; i++) {
        this.currencies.push({ name: names[i], symbol: symbols[i] });
      }
      this.currencyForm.patchValue({ to: this.to, from: this.from, amount: this.amount });
    });
  }

  fetchHistoricData() {
    this.apiService.getHistoricalData(this.currencyForm.value.from, this.currencyForm.value.to).subscribe((response: HistoricalDataResponse) => {
    this.historicalData = response.rates;
    

    let labels: string[] = [];
    let values: number[] = [];
    Object.values(response.rates).forEach((item: Object) => {
      let record: number[] = Object.values(item);
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

export interface HistoricalDataResponse {
  "base": string,
  "end_date": string,
  "rates": Object,
  "start_date": string,
  "success": boolean,
  "timeseries": boolean
}