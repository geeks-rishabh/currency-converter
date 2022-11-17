import { HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from './api.service';
class FakeApiService {
  // Implement the methods you want to overload here
  getData() {
    return of({ items: [] }); // * mocks the return of the real method
  }

  getExchangeRates(params:any){
    return of();
  }

  getCurrencyList(){
    return of();
  }

  getHistoricalData(currencyFrom: string, currencyTo: string, previousYearDate: string, currentYearDate: string){
    return of();
  }

  getLatestConversionRate(queryParams: string, base: string){
    return of();
  }
}
describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientModule],providers:[{
      provide: ApiService,
      useClass: ApiService,
    }]});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getExchangeRates', () => {
    service.getExchangeRates("");
  });
  
  it('should call getCurrencyList', () => {
    service.getCurrencyList();
  });

  it('should call getHistoricalData', () => {
    service.getHistoricalData("EUR","USD","2022-10-1","2021-10-1");
  });
  
  it('should call getHistoricalData', () => {
    service.getLatestConversionRate("EUR","USD");
  });
  
  
  it('should call getHistoricalData', () => {
  
    service.handleError({} as HttpErrorResponse);
  });
  

});
