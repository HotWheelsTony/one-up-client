import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { AccountResource } from '../../models/resources/account-resource.interface';
import { TransactionResource } from '../../models/resources/transaction-resource.interface';
import { TransactionsService } from '../../services/transactions.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

    public account?: AccountResource;
    public transactions: TransactionResource[] = [];
    public nextPageUrl?: string;

    private _routeParamsSubscription?: Subscription;


    constructor(private _transactionsService: TransactionsService, private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }


    ngOnInit(): void {
        this._routeParamsSubscription = this._activatedRoute.paramMap.subscribe(
            async (routeParams) => {
                const accountId = routeParams.get('accountId');

                if (accountId) {
                    this.account = (await lastValueFrom(this._accountsService.getAccount(accountId))).data;
                    this.loadTransactions();
                }
            }
        );
    }


    ngOnDestroy(): void {
        this._routeParamsSubscription?.unsubscribe();
    }


    private async loadTransactions() {
        if (!this.account) {
            return;
        }
        const response = (await lastValueFrom(this._transactionsService.listAccountTransactions(this.account.id)));
        this.transactions = this.calculateRemainingBalances(this.account, response.data);
        this.nextPageUrl = response.links?.next as string;
    }


    private async loadMoreTransactions() {
        if (!this.account) {
            return;
        }
        if (this.nextPageUrl) {
            const response = (await lastValueFrom(this._transactionsService.getNextPage(this.nextPageUrl)));
            const nextPageTxns = response.data;
            this.nextPageUrl = response.links?.next;

            this.transactions = this.calculateRemainingBalances(this.account, this.transactions.concat(nextPageTxns));
        }
    }


    private calculateRemainingBalances(account: AccountResource, transactions: TransactionResource[]): TransactionResource[] {
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];

            //ignore balances we've already calculated
            if (transaction.remainingBalance) {
                continue;
            }

            if (i === 0) {
                transaction.remainingBalance = account.attributes.balance.valueInBaseUnits / 100;
            } else {
                const nextChronoligicalTransaction = transactions[i - 1];
                transaction.remainingBalance = nextChronoligicalTransaction.remainingBalance - (nextChronoligicalTransaction.attributes.amount.valueInBaseUnits / 100);
            }
        }
        return transactions;
    }


    public async handleRefresh(event: any) {
        await this.loadTransactions();
        event.target.complete();
    }


    public async handleScroll(event: any) {
        await this.loadMoreTransactions();
        event.target.complete();
    }


}
