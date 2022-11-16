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
  currencies: any[] = [{ name: 'United States Dollar', symbol: 'USD' }, { name: 'Great Britain Pound', symbol: 'GBP' }, { name: 'Euro', symbol: 'EUR' }];
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

  constructor(private router:Router,private route:ActivatedRoute,  private apiService: ApiService) { }

  ngOnInit(): void {

    this.currencyForm = new FormGroup({
      amount: new FormControl('1', [Validators.required]),
      from: new FormControl('EUR', [Validators.required]),
      to: new FormControl('USD', [Validators.required]),
    });

    
    this.route.params.subscribe(params => {
      console.log(params);
      this.to = params['to'];
      this.from = params['from'];
      this.amount = params['amount'];
      this.currencyForm.patchValue({to:this.to, from:this.from, amount: this.amount});
      
  });

    // this.fetchCurrencyList();
    this.convertCurrency();
    this.fetchHistoricData();
  }
  convertCurrency() {
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

    for (let i = 0; i < symbols.length; i++) {

      if ((this.currencyForm.value.to === symbols[i]) || (this.currencyForm.value.from === symbols[i])) {

      } else { this.latestRates.push({ rate: rates[i], symbol: symbols[i] }); }
    }

  }

  fetchHistoricData() {
    const response = {
      "base": "EUR",
      "end_date": "2022-11-15",
      "rates": {
        "2022-11-01": {
          "GBP": 0.859804
        },
        "2022-11-02": {
          "GBP": 0.862257
        },
        "2022-11-03": {
          "GBP": 0.872733
        },
        "2022-11-04": {
          "GBP": 0.877287
        },
        "2022-11-05": {
          "GBP": 0.87748
        },
        "2022-11-06": {
          "GBP": 0.876331
        },
        "2022-11-07": {
          "GBP": 0.869848
        },
        "2022-11-08": {
          "GBP": 0.872598
        },
        "2022-11-09": {
          "GBP": 0.88134
        },
        "2022-11-10": {
          "GBP": 0.871222
        },
        "2022-11-11": {
          "GBP": 0.878075
        },
        "2022-11-12": {
          "GBP": 0.876275
        },
        "2022-11-13": {
          "GBP": 0.875386
        },
        "2022-11-14": {
          "GBP": 0.878171
        },
        "2022-11-15": {
          "GBP": 0.871594
        }
      },
      "start_date": "2022-11-01",
      "success": true,
      "timeseries": true
    };

    this.historicalData = response.rates;
    let labels: string[] = [];
    let values: number[] = [];
    labels = Object.keys(response.rates);
    Object.values(response.rates).forEach(item => {
      let record = Object.values(item);
      values.push(record[0]);
    })

    this.lineChartData = {
      labels: labels,
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

  /*  this.apiService.getHistoricalData().subscribe((res:any)=>{
      this.historicalData = response.rates;
      let labels: string[] = [];
      let values: number[] = [];
      Object.values(response.rates).forEach(item => {
        let record = Object.values(item);
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
  
    });*/
  }
  f() {
    return this.currencyForm.value;
  }
}
