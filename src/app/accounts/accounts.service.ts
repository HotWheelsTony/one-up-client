import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap, map } from 'rxjs'
import { Account } from './account';
import { Transaction } from '../transactions/transaction';
import { AccountResource } from '../models/account-resource.interface';
import { Links } from '../models/links.interface';
import { TransactionResource } from '../models/transaction-resource.interface';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {

    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1/accounts';
    private readonly _tokenPath: string = 'assets/token.txt';
    private _cachedToken?: string;


    constructor(private http: HttpClient) { }

    private getToken(): Observable<string> {
        if (this._cachedToken) {
            return from([this._cachedToken]);
        }

        return this.http.get(this._tokenPath, { responseType: 'text' }).pipe(
            switchMap((token) => {
                this._cachedToken = token;
                return from([token]);
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

    public listAccounts(): Observable<{ data: AccountResource[], links: Links }> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get<{ data: AccountResource[], links: Links }>(`${this._baseUrl}`, { headers }).pipe(
                    map((response) => ({
                        data: response.data as AccountResource[],
                        links: response.links as Links
                    }))
                );
            })
        );
    }

    public getAccount(id: string): Observable<{ data: AccountResource }> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get<{ data: AccountResource }>(`${this._baseUrl}/${id}`, { headers }).pipe(
                    map((response) => ({
                        data: response.data as AccountResource
                    }))
                );
            })
        );
    }

    public listTransactions(account: AccountResource): Observable<{ data: TransactionResource[], links: Links }> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get<{ data: TransactionResource[], links: Links }>(`${this._baseUrl}/${account.id}/transactions`, { headers }).pipe(
                    map((response) => ({
                        data: this.calculateRemainingBalances(account, response.data),
                        links: response.links
                    }))
                );
            })
        );
    }

    public loadMoreTransactions() {
        // Response.links.next
    }

    private calculateRemainingBalances(account: AccountResource, transactions: TransactionResource[]): TransactionResource[] {
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            if (i === 0) {
                transaction.remainingBalance = account.attributes.balance.valueInBaseUnits / 100;
            } else {
                const nextChronoligicalTransaction = transactions[i - 1];
                transaction.remainingBalance = nextChronoligicalTransaction.remainingBalance - (nextChronoligicalTransaction.attributes.amount.valueInBaseUnits / 100);
            }
        }
        return transactions;
    }

}
