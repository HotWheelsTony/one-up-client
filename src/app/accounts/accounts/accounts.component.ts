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

    public navigateToTransactions(account: Account) {
        console.log('navigating to transactions');
        this._router.navigate([account.id, 'transactions']);
    }


    public refresh() {
        this._accountsService.getAccounts().subscribe(
            (response) => {
                this.accounts = response.data.map((acc: any) => {
                    const account = new Account();
                    account.id = acc.id;
                    account.currency = acc.attributes.balance.currencyCode;
                    account.name = acc.attributes.displayName;
                    account.value = acc.attributes.balance.value;
                    return account;
                }) as Account[];
            }
        )
    }

}


