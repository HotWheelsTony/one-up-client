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
            (response) => {
                const acc = response.data;
                this.account = {
                    id: acc.id,
                    name: acc.attributes.displayName,
                    value: acc.attributes.balance.value,
                    currency: acc.attributes.balance.currencyCode,
                } as Account;
            }
        );
    }

    private getTransactions(id: string) {
        this._accountsService.getAccountTransactions(id).subscribe(
            (response) => {
                this.transactions = response.data.map((trans: any) => {
                    return {
                        id: trans.id,
                        status: trans.attributes.status,
                        message: trans.attributes.message,
                        value: trans.attributes.amount.value,
                        description: trans.attributes.description,
                        currency: trans.attributes.amount.currencyCode,
                    } as Transaction;
                }) as Transaction[];
                console.log(this.transactions);
            }
        );
    }


}
