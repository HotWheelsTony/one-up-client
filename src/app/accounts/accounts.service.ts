import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs'
import { Account } from './account';
import { Transaction } from './transactions/transaction';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {


    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1/accounts';
    private readonly _tokenPath: string = 'assets/token.txt';
    private _cachedToken: string | null = null;


    constructor(
        private http: HttpClient
    ) { }


    private getToken(): Observable<string> {
        if (this._cachedToken) {
            return from([this._cachedToken]);
        }

        return this.http.get(this._tokenPath, { responseType: 'text' }).pipe(
            switchMap((token) => {
                this._cachedToken = token;
                return from([token])
            })
        );
    }

    private amendHeaders(): Observable<HttpHeaders> {
        return this.getToken().pipe(
            switchMap((token) => {
                return from([new HttpHeaders().set('Authorization', `Bearer ${token}`)]);
            })
        );
    }

    public getAccounts(): Observable<Account[]> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get(`${this._baseUrl}`, { headers }).pipe(
                    switchMap((response: any) => {
                        return from([response.data.map((account: any) => {
                            return {
                                id: account.id,
                                name: account.attributes.displayName,
                                value: account.attributes.balance.value,
                                currency: account.attributes.balance.currencyCode,
                            } as Account;
                        })]) as Observable<Account[]>;
                    })
                );
            })
        );
    }

    public getAccountById(id: string): Observable<Account> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get(`${this._baseUrl}/${id}`, { headers }).pipe(
                    switchMap((response: any) => {
                        const account = response.data;
                        return from([{
                            id: account.id,
                            name: account.attributes.displayName,
                            value: account.attributes.balance.value,
                            currency: account.attributes.balance.currencyCode,
                        }]) as Observable<Account>;
                    })
                );
            })
        );
    }

    public getAccountTransactions(accountId: string): Observable<Transaction[]> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get(`${this._baseUrl}/${accountId}/transactions`, { headers }).pipe(
                    switchMap((response: any) => {
                        return from([response.data.map((transaction: any) => {
                            return {
                                id: transaction.id,
                                status: transaction.attributes.status,
                                message: transaction.attributes.message,
                                value: transaction.attributes.amount.value,
                                description: transaction.attributes.description,
                                currency: transaction.attributes.amount.currencyCode,
                            } as Transaction;
                        })]) as Observable<Transaction[]>;
                    })
                );
            })
        );
    }

}
