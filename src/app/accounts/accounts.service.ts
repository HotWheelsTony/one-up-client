import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, of } from 'rxjs'
import { AccountResource } from '../models/resources/account-resource.interface';
import { TransactionResource } from '../models/resources/transaction-resource.interface';
import { ApiResponse } from '../models/api-response.interface';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {


    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1/accounts';


    constructor(private _http: HttpClient, private _authService: AuthService) { }

    public listAccounts(): Observable<ApiResponse<AccountResource[]>> {
        return this._authService.createHeaders().pipe(
            switchMap((headers) => {
                return this._http.get<ApiResponse<AccountResource[]>>(`${this._baseUrl}`, { headers }).pipe(
                    map((response) => ({
                        data: response.data as AccountResource[],
                        links: response.links
                    }))
                );
            })
        );
    }

    public getAccount(id: string): Observable<ApiResponse<AccountResource>> {
        return this._authService.createHeaders().pipe(
            switchMap((headers) => {
                return this._http.get<ApiResponse<AccountResource>>(`${this._baseUrl}/${id}`, { headers }).pipe(
                    map((response) => ({
                        data: response.data as AccountResource
                    }))
                );
            })
        );
    }

    public listTransactions(account: AccountResource): Observable<ApiResponse<TransactionResource[]>> {
        return this._authService.createHeaders().pipe(
            switchMap((headers) => {
                return this._http.get<ApiResponse<TransactionResource[]>>(`${this._baseUrl}/${account.id}/transactions`, { headers }).pipe(
                    map((response) => ({
                        data: this.calculateRemainingBalances(account, response.data) as TransactionResource[],
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
