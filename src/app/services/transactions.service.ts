import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, switchMap, map } from 'rxjs';
import { TransactionResource } from '../models/resources/transaction-resource.interface';
import { ApiResponse } from '../models/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class TransactionsService {

    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1';

    constructor(private _http: HttpClient, private _authService: AuthService) { }

    public listAllTransactions(): Observable<ApiResponse<TransactionResource[]>> {
        return this._authService.createHeaders().pipe(
            switchMap((headers) => {
                return this._http.get<ApiResponse<TransactionResource[]>>(`${this._baseUrl}/transactions`, { headers }).pipe(
                    map((response) => ({
                        data: response.data as TransactionResource[],
                        links: response.links
                    }))
                );
            })
        );
    }

    public listAccountTransactions(accountId: string): Observable<ApiResponse<TransactionResource[]>> {
        return this._authService.createHeaders().pipe(
            switchMap((headers) => {
                return this._http.get<ApiResponse<TransactionResource[]>>(`${this._baseUrl}/accounts/${accountId}/transactions`, { headers }).pipe(
                    map((response) => ({
                        data: response.data as TransactionResource[],
                        links: response.links
                    }))
                );
            })
        );
    }

    public getTransaction(transactionId: string): Observable<ApiResponse<TransactionResource>> {
        return this._authService.createHeaders().pipe(
            switchMap((headers) => {
                return this._http.get<ApiResponse<TransactionResource>>(`${this._baseUrl}/transactions/${transactionId}`, { headers }).pipe(
                    map((response) => ({
                        data: response.data as TransactionResource
                    }))
                );
            })
        );
    }

    public getNextPage(url: string) {
        return this._authService.createHeaders().pipe(
            switchMap((headers) => {
                return this._http.get<ApiResponse<TransactionResource[]>>(url, { headers }).pipe(
                    map((response) => ({
                        data: response.data as TransactionResource[],
                        links: response.links
                    }))
                );
            })
        );
    }

}
