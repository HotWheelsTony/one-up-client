import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';
import { Subscription } from 'rxjs';
import { AccountResource } from '../../models/resources/account-resource.interface';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

    public accounts: AccountResource[] = [];

    private _accountsSubscription?: Subscription;


    constructor(private _accountsService: AccountsService) { }

    ngOnInit(): void {
        this.listAccounts();
    }

    ngOnDestroy(): void {
        this._accountsSubscription?.unsubscribe();
    }

    public listAccounts(): void {
        this._accountsSubscription = this._accountsService.listAccounts().subscribe(
            (response) => {
                this.accounts = response.data;
            }
        );
    }

}


