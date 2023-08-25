import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../accounts/account';
import { AccountsService } from '../accounts/accounts.service';
import { Transaction } from './transaction';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

    public account: Account = new Account();
    public transactions!: Transaction[];

    private _accountSubscription: Subscription | null = null;
    private _transactionsSubscription: Subscription | null = null;


    constructor(private _accountsService: AccountsService, private _router: Router, private _activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this._activatedRoute.snapshot.paramMap.get('accountId');
        if (id) {
            this.getAccountInfo(id);
            this.getTransactions(id);
        }
    }

    ngOnDestroy(): void {
        this._accountSubscription?.unsubscribe();
        this._transactionsSubscription?.unsubscribe();
    }

    private getAccountInfo(id: string) {
        this._accountSubscription = this._accountsService.getAccountById(id).subscribe(
            (account) => {
                this.account = account;
            }
        );
    }

    private getTransactions(id: string) {
        this._transactionsSubscription = this._accountsService.getAccountTransactions(id).subscribe(
            (transactions) => {
                this.transactions = transactions;
            }
        );
    }


}
