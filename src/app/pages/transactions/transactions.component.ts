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
        this.transactions = response.data;
        this.nextPageUrl = response.links?.next as string;
    }


    public async handleRefresh(event: any) {
        await this.loadTransactions();
        event.target.complete();
    }


}
