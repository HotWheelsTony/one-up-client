import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../accounts/accounts.service';
import { Transaction } from './transaction';
import { Subscription } from 'rxjs';
import { AccountResource } from '../models/account-resource.interface';
import { TransactionResource } from '../models/transaction-resource.interface';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

    public account?: AccountResource;
    public transactions: TransactionResource[] = [];

    private _accountSubscription?: Subscription;
    private _transactionsSubscription?: Subscription;
    private _links?: {
        prev?: string,
        next?: string
    }


    constructor(private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }

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
                this.listTransactions(this.account);
            }
        );
    }

    private listTransactions(account: AccountResource) {
        this._transactionsSubscription = this._accountsService.listTransactions(account).subscribe(
            (response) => {
                this.transactions = response.data;
                this._links = response.links;
            }
        );
    }




}
