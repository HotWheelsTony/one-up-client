import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { Account } from '../account';
import { Router } from '@angular/router';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
    public title = 'Accounts';
    public responseData: any | null = null;
    public accounts: Account[] = [];


    constructor(private _accountsService: AccountsService, private _router: Router) { }

    ngOnInit(): void {
        this.refresh();
    }

    public navigateToTransactions(accountId: string) {
        this._router.navigate([accountId]);
    }


    public refresh() {
        this._accountsService.getAccounts().subscribe(
            (accounts) => {
                this.accounts = accounts;
            }
        );
    }

}


