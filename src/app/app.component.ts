import { Component, OnInit } from '@angular/core';
import { AccountsService } from './accounts.service';
import { Account } from './account';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'one-up-client';

    responseData: any;
    accountsData: Account[] = [];


    constructor(private accountsService: AccountsService) { }

    ngOnInit(): void {
        this.refreshAccounts();
    }

    async refreshAccounts() {
        this.accountsService.refresh();
    }

    async ping() {
        this.responseData = await this.accountsService.ping();
    }
}
