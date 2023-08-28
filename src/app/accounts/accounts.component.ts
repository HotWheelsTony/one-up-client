import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from './accounts.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountResource } from '../models/account-resource.interface';
import { Links } from '../models/links.interface';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

    public accounts: AccountResource[] = [];
    private _links: Links = { prev: null, next: null };

    private _accountsSubscription: Subscription | null = null;


    constructor(private _accountsService: AccountsService, private _router: Router) { }

    ngOnInit(): void {
        this.getAccounts();
    }

    ngOnDestroy(): void {
        this._accountsSubscription?.unsubscribe();
    }

    public navigateToTransactions(accountId: string) {
        this._router.navigate([accountId]);
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


