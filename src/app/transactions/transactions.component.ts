import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '../accounts/accounts.service';
import { Subscription } from 'rxjs';
import { AccountResource } from '../models/resources/account-resource.interface';
import { TransactionResource } from '../models/resources/transaction-resource.interface';
import { ApiResponse } from '../models/api-response.interface';
import { TransactionsService } from '../services/transactions.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

    public response?: ApiResponse<TransactionResource | TransactionResource[]>;
    public account?: AccountResource;
    public transactions: TransactionResource[] = [];

    private _accountSubscription?: Subscription;
    private _transactionsSubscription?: Subscription;



    constructor(private _transactionsService: TransactionsService, private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const accountId = this._activatedRoute.snapshot.paramMap.get('accountId');
        if (accountId) {
            this.getAccount(accountId);
        }
    }

    ngOnDestroy(): void {
        this._accountSubscription?.unsubscribe();
        this._transactionsSubscription?.unsubscribe();
    }

    private getAccount(id: string) {
        this._accountSubscription = this._accountsService.getAccount(id).subscribe(
            (response) => {
                this.account = response.data;
                this.listTransactions(this.account.id);
            }
        );
    }

    private listTransactions(accountId: string) {
        this._transactionsSubscription = this._transactionsService.listAccountTransactions(accountId).subscribe(
            (response) => {
                this.response = response;
                this.transactions = this.calculateRemainingBalances(this.account!, response.data);
            }
        );
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
