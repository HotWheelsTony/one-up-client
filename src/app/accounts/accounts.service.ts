import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap, map } from 'rxjs'
import { Account } from './account';
import { Transaction } from '../transactions/transaction';
import { AccountResource } from '../models/account-resource.interface';
import { Links } from '../models/links.interface';

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

    // public getAccounts(): Observable<Account[]> {
    //     return this.amendHeaders().pipe(
    //         switchMap((headers) => {
    //             return this.http.get(`${this._baseUrl}`, { headers }).pipe(
    //                 switchMap((response: any) => {
    //                     return from([response.data.map((account: any) => {
    //                         return {
    //                             id: account.id,
    //                             name: account.attributes.displayName,
    //                             value: account.attributes.balance.value,
    //                             currency: account.attributes.balance.currencyCode,
    //                         } as Account;
    //                     })]) as Observable<Account[]>;
    //                 })
    //             );
    //         })
    //     );
    // }

    public getAccounts(): Observable<{ data: AccountResource[], links: Links }> {
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

    public getAccountTransactions(account: Account): Observable<Transaction[]> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get(`${this._baseUrl}/${account.id}/transactions`, { headers }).pipe(
                    switchMap((response: any) => {
                        return from([this.calculateRemainingBalances(
                            account,
                            response.data.map((transaction: any) => {
                                return {
                                    id: transaction.id,
                                    status: transaction.attributes.status,
                                    message: transaction.attributes.message,
                                    value: transaction.attributes.amount.value,
                                    settledDate: transaction.attributes.settledAt,
                                    createdDate: transaction.attributes.createdAt,
                                    description: transaction.attributes.description,
                                    currency: transaction.attributes.amount.currencyCode,
                                } as Transaction;
                            }))
                        ]);
                    })
                );
            })
        );
    }

    public loadMoreTransactions() {
        // Response.links.next
    }

    private calculateRemainingBalances(account: Account, transactions: Transaction[]): Transaction[] {
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            if (i === 0) {
                transaction.remainingBalance = account.value;
            } else {
                const nextChronoligicalTransaction = transactions[i - 1];
                transaction.remainingBalance = nextChronoligicalTransaction.remainingBalance - nextChronoligicalTransaction.value;
            }
        }
        return transactions;
    }

}
