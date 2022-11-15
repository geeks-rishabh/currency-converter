import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient:HttpClient) { }

  getExchangeRates(params:any):Observable<any>{
    var myHeaders = new Headers();
    myHeaders.append("apikey", "A6lWD3H4lohFZc0T144QcyVvgvZwlpgV");
    
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };

    return this.httpClient.get(`https://api.apilayer.com/fixer/convert?to=${params.to}&from=${params.from}&amount=${params.amount}`,{
      headers: {"apikey": "A6lWD3H4lohFZc0T144QcyVvgvZwlpgV"}
    } ).pipe(catchError(this.handleError));
  }

  
  getHistoricalData():Observable<any>{
    var myHeaders = new Headers();
    myHeaders.append("apikey", "A6lWD3H4lohFZc0T144QcyVvgvZwlpgV");
  

    return this.httpClient.get("https://api.apilayer.com/fixer/fluctuation?start_date=2022-11-01&end_date=2022-11-15",{
      headers: {"apikey": "A6lWD3H4lohFZc0T144QcyVvgvZwlpgV"}
    } ).pipe(catchError(this.handleError));
  }

  
  getCurrencyList():Observable<any>{
    var myHeaders = new Headers();
    myHeaders.append("apikey", "A6lWD3H4lohFZc0T144QcyVvgvZwlpgV");
  

    return this.httpClient.get("https://api.apilayer.com/fixer/symbols",{
      headers: {"apikey": "A6lWD3H4lohFZc0T144QcyVvgvZwlpgV"}
    } ).pipe(catchError(this.handleError));
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
