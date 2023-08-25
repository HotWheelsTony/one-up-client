import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { Account } from '../account';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

    public responseData: any | null = null;
    public accounts: Account[] = [];

    private _accountsSubscription: Subscription | null = null;


    constructor(private _accountsService: AccountsService, private _router: Router) { }

    ngOnInit(): void {
        this.refresh();
    }

    ngOnDestroy(): void {
        this._accountsSubscription?.unsubscribe();
    }

    public navigateToTransactions(accountId: string) {
        this._router.navigate([accountId]);
    }


    public refresh() {
        this._accountsSubscription = this._accountsService.getAccounts().subscribe(
            (accounts) => {
                this.accounts = accounts;
            }
        );
    }

}


