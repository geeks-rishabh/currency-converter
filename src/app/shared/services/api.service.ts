import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    headers = {
        headers: { "apikey": environment.fixerKey }
    };
    constructor(private httpClient: HttpClient) { }
    getExchangeRates(params: any): Observable<any> {
        return this.httpClient.get(`${environment.apiURL}convert?to=${params.to}&from=${params.from}&amount=${params.amount}`, this.headers).pipe(catchError(this.handleError));
    }

    getHistoricalData(currencyFrom: string, currencyTo: string, previousYearDate: string, currentYearDate: string): Observable<any> {
        return this.httpClient.get(`${environment.apiURL}timeseries?start_date=${previousYearDate}&end_date=${currentYearDate}&base=${currencyFrom}&symbols=${currencyTo}`, this.headers).pipe(catchError(this.handleError));
    }

    getCurrencyList(): Observable<any> {
        return this.httpClient.get(`${environment.apiURL}symbols`, this.headers).pipe(catchError(this.handleError));
    }

    getLatestConversionRate(queryParams: string, base: string): Observable<any> {
        return this.httpClient.get(`${environment.apiURL}latest?symbols=${queryParams}&base=${base}`, this.headers).pipe(catchError(this.handleError));
    }

    handleError(error: HttpErrorResponse) {
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
