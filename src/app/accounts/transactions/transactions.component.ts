import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../account';
import { AccountsService } from '../accounts.service';
import { Transaction } from './transaction';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

    public account!: Account;
    public transactions!: Transaction[];


    constructor(private _accountsService: AccountsService, private _router: Router, private _activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this._activatedRoute.snapshot.paramMap.get('accountId');
        if (id) {
            this.getAccountInfo(id);
            this.getTransactions(id);
        }
    }

    private getAccountInfo(id: string) {
        this._accountsService.getAccountById(id).subscribe(
            (account) => {
                this.account = account;
            }
        );
    }

    private getTransactions(id: string) {
        this._accountsService.getAccountTransactions(id).subscribe(
            (transactions) => {
                this.transactions = transactions;
            }
        );
    }


}
