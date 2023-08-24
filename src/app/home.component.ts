import { Component, OnInit } from '@angular/core';
import { AccountsService } from './accounts/accounts.service';
import { Account } from './accounts/account';

@Component({
    selector: 'app-root',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public title = 'Accounts';
    public responseData: any | null = null;
    public accounts: Account[] = [];


    constructor(private accountsService: AccountsService) { }

    ngOnInit(): void {
        this.refresh();
    }


    refresh() {
        this.accountsService.getAccounts().subscribe(
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

