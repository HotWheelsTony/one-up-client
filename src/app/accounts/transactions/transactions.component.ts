import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../account';
import { AccountsService } from '../accounts.service';
import { map } from 'rxjs'

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {

    public account!: Account;


    constructor(private _accountsService: AccountsService, private _router: Router, private _activatedRoute: ActivatedRoute) {
        const id = this._activatedRoute.snapshot.paramMap.get('accountId');
        if (id) {
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

    }


}
