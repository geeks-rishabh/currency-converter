import { formatNumber } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { cO } from 'chart.js/dist/chunks/helpers.core';
import { of } from 'rxjs';
import { ApiService } from '../shared/services/api.service';

import { CurrencyConverterHomeComponent } from './currency-converter-home.component';
class FakeApiService {
  // Implement the methods you want to overload here
  getCurrencyList() {
    return of({ 
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
   }); // * mocks the return of the real method
  }

  getExchangeRates(){
    return of({
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
    })
  }
}
describe('CurrencyConverterHomeComponent', () => {
  let component: CurrencyConverterHomeComponent;
  let fixture: ComponentFixture<CurrencyConverterHomeComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  let apiService:ApiService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyConverterHomeComponent ],imports:[FormsModule, ReactiveFormsModule,HttpClientModule],providers:[{
        provide: ApiService,
        useClass: FakeApiService,
      },{ provide: Router, useValue: router }]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetchCurrencyList',()=>{
    const service = TestBed.get(ApiService);
  const spyOnMethod = spyOn(service, 'getCurrencyList').and.callThrough();
  // act
  component.fetchCurrencyList();
  // assert
  expect(spyOnMethod).toHaveBeenCalled();
// expect(component.fetchCurrencyList).toHaveBeenCalled();
  });


  it('should convertCurrency',()=>{
    const service = TestBed.get(ApiService);
  const spyOnMethod = spyOn(service, 'getExchangeRates').and.callThrough();
  // act
  component.convertCurrency();
  // assert
  expect(spyOnMethod).toHaveBeenCalled();
// expect(component.fetchCurrencyList).toHaveBeenCalled();
  });
});
