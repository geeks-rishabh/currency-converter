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

  currencies: Currency[] = [];

  historicalData: any = [];
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

  currentYear: number;
  currentMonth: number;
  currentDate: number;

  lastYearDate: string;
  currentYearDate: string;
  monthDate: string[] = [];
  constructor(private route: ActivatedRoute, private apiService: ApiService) {


    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth() + 1;
    this.currentDate = new Date().getDate();

    this.lastYearDate = this.lastYearDateCall();
    this.currentYearDate = this.currentYear + '-' + this.currentMonth + '-' + this.currentDate;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.to = params['to'];
      this.from = params['from'];
      this.amount = params['amount'];
      this.fetchHistoricData();
      this.monthDate = this.lastDayOfMonth(this.currentMonth-1, this.currentYear);
    });
  }

  lastDayOfMonth(month: any, year: number): string[] {
    let monthCounter = month;
    let yearCounter = year;
    let i = 0
    let x = []
    while (i < 12) {
      if (monthCounter == 0) {
        monthCounter = 12;
        yearCounter = yearCounter - 1;
      }

      if (JSON.stringify(monthCounter).length == 1) {
        monthCounter = ("0" + JSON.stringify(monthCounter)).slice(-2);
        x.push(yearCounter + "-" + monthCounter + "-" + this.lastDay(yearCounter, monthCounter))
      } else {
        x.push(yearCounter + "-" + monthCounter + "-" + this.lastDay(yearCounter, monthCounter))
      }

      monthCounter--;
      i++;
    }

    return x;
  }


  lastDay(y: number, m: number): any {
    return new Date(y, m, 0).getDate();
  }

  lastYearDateCall(): any {
    let d = new Date();
    let pastYear = d.getFullYear() - 1;
    d.setFullYear(pastYear);
    // console.log(d.toISOString().slice(0, 10));
    return d.toISOString().slice(0, 10);
  }


  fetchHistoricData() {
    this.apiService.getHistoricalData(this.from, this.to,this.lastYearDate, this.currentYearDate).subscribe((response: HistoricalDataResponse) => {
      console.log();
      this.historicalData = response.rates;
      let values: number[] = [];
      this.monthDate.forEach((month: string) => {
        console.log(this.historicalData[month]);
        if(this.historicalData[month]){
          values.push(this.historicalData[month][this.to]);
        }
      });




      // Object.values(response.rates).forEach((item: Object) => {
      //   let record: number[] = Object.values(item);
      //   values.push(record[0]);

      // })

      this.lineChartData = {
        labels: this.monthDate.reverse().map((month)=>this.getMonthName(month)),//Object.keys(response.rates),
        datasets: [
          {
            data: values.reverse(),
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
  getMonthName(passed:string){
    let date = new Date(passed);  // 2009-11-10
    let monthY = date.toLocaleString('default', { month: 'long' }) + ', ' + date.getFullYear();
    return monthY;
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