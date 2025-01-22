import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { Subscription, lastValueFrom } from 'rxjs';
import { AccountResource } from 'src/app/models/resources/account-resource.interface';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    public account?: AccountResource;
    public transactions: TransactionResource[] = [];
    public nextPageUrl?: string;

    public since: DateTime = DateTime.now().minus({ weeks: 1 });
    public until: DateTime = DateTime.now();

    public query: string = '';
    public fromAmount: number = Number.NEGATIVE_INFINITY;
    public toAmount: number = Number.POSITIVE_INFINITY;

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


    public async loadTransactions() {
        if (!this.account) {
            return;
        }

        const response = (await lastValueFrom(this._transactionsService.listAccountTransactions(this.account.id, this.since.startOf('day'), this.until.endOf('day'))));
        this.nextPageUrl = response.links?.next;
        this.transactions = response.data;
    }


    public handleQuery(event: any) {
        this.query = event.target.value;
    }


    public async handleSinceChange(event: any) {
        this.since = DateTime.fromISO(event.target.value);
        await this.loadTransactions();
    }


    public async handleUntilChange(event: any) {
        this.until = DateTime.fromISO(event.target.value);
        await this.loadTransactions();
    }


    public handleFromAmountChange(event: any) {
        const value = +event.target.value;
        this.fromAmount = value > 0 ? value : Number.NEGATIVE_INFINITY;
    }


    public handleToAmountChange(event: any) {
        const value = +event.target.value;
        this.toAmount = value > 0 ? value : Number.POSITIVE_INFINITY;
    }


}
