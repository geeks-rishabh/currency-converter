import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../shared/services/api.service';

import { CurrencyConverterComponent } from './currency-converter.component';
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
describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyConverterComponent ],imports:[FormsModule, ReactiveFormsModule,HttpClientModule],providers:[{
        provide: ApiService,
        useClass: FakeApiService,
      },{ provide: Router, useValue: router }]
})
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should call swap', () => {
    component.swap();
  });
  
  it('should call convertCurrency', () => {
    component.convertCurrency();
  });
});