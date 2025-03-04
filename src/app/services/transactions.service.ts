import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';
import { TransactionResource } from '../models/resources/transaction-resource.interface';
import { ApiResponse } from '../models/api-response.interface';
import { DateTime } from 'luxon';

@Injectable({
    providedIn: 'root'
})
export class TransactionsService {

    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1';

    constructor(private _http: HttpClient, private _authService: AuthService) { }

    public listAllTransactions(): Observable<ApiResponse<TransactionResource[]>> {
        const headers = this._authService.createHeaders();
        return this._http.get<ApiResponse<TransactionResource[]>>(`${this._baseUrl}/transactions`, { headers }).pipe(
            map((response) => ({
                data: response.data as TransactionResource[],
                links: response.links
            }))
        );

    }

    // Maximum of 100 results per page
    public listAccountTransactions(accountId: string,
        since: DateTime = DateTime.now().minus({ years: 100 }), //should be enough right
        until: DateTime = DateTime.now(),
        resultsPerPage: number = 20
    ): Observable<ApiResponse<TransactionResource[]>> {
        const params = new HttpParams()
            .set('page[size]', resultsPerPage)
            .set('filter[since', since.toISO()!)
            .set('filter[until', until.toISO()!);

        const headers = this._authService.createHeaders();
        return this._http.get<ApiResponse<TransactionResource[]>>(`${this._baseUrl}/accounts/${accountId}/transactions`, { headers, params }).pipe(
            map((response) => ({
                data: response.data as TransactionResource[],
                links: response.links
            }))
        );

    }

    public getTransaction(transactionId: string): Observable<ApiResponse<TransactionResource>> {
        const headers = this._authService.createHeaders();
        return this._http.get<ApiResponse<TransactionResource>>(`${this._baseUrl}/transactions/${transactionId}`, { headers }).pipe(
            map((response) => ({
                data: response.data as TransactionResource
            }))
        );

    }

    // Maximum of 100 results per page
    public getNextPage(url: string, resultsPerPage: number = 20) {
        const params = new HttpParams().set('page[size]', resultsPerPage);
        const headers = this._authService.createHeaders();

        return this._http.get<ApiResponse<TransactionResource[]>>(url, { headers, params }).pipe(
            map((response) => ({
                data: response.data as TransactionResource[],
                links: response.links
            }))
        );

    }

}
