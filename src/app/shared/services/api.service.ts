import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getExchangeRates(params: any): Observable<any> {

    return this.httpClient.get(`https://api.apilayer.com/fixer/convert?to=${params.to}&from=${params.from}&amount=${params.amount}`, {
      headers: { "apikey": environment.fixerKey }
    }).pipe(catchError(this.handleError));
  }

  getHistoricalData(): Observable<any> {
    let start_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
    let today = new Date().toISOString().split('T')[0];
    console.log();
    return this.httpClient.get(`https://api.apilayer.com/fixer/fluctuation?start_date=${start_date}&end_date=${today}`, {
      headers: { "apikey": environment.fixerKey }
    }).pipe(catchError(this.handleError));
  }


  getCurrencyList(): Observable<any> {

    return this.httpClient.get("https://api.apilayer.com/fixer/symbols", {
      headers: { "apikey": environment.fixerKey }
    }).pipe(catchError(this.handleError));
  }

  getLatestConversionRate(): Observable<any> {

    return this.httpClient.get("https://api.apilayer.com/fixer/latest?symbols=USD,EUR,GBP,JPY,AUD,CAD,CHF,CNH,HKD,NZD&base=EUR", {
      headers: { "apikey": environment.fixerKey }
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
