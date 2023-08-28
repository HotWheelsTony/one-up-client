import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from './accounts.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountResource } from '../models/account-resource.interface';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

    public accounts: AccountResource[] = [];
    private _links = { prev: null, next: null };

    private _accountsSubscription: Subscription | null = null;


    constructor(private _accountsService: AccountsService, private _router: Router) { }

    ngOnInit(): void {
        this.getAccounts();
    }

    ngOnDestroy(): void {
        this._accountsSubscription?.unsubscribe();
    }

    public navigateToTransactions(account: AccountResource) {
        this._router.navigate([account.id]);
    }

    public getAccounts(): void {
        this._accountsService.listAccounts().subscribe(
            (response) => {
                this.accounts = response.data;
                response.data[0].attributes.balance.valueInBaseUnits;
            }
        );
    }

}


