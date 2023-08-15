import { Component, OnInit } from '@angular/core';
import { AccountsService } from './accounts.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Accounts';

    responseData: any | null = null;
    accountsData: any | null = null;


    constructor(private accountsService: AccountsService) { }

    ngOnInit(): void {
        this.refreshAccounts();
    }

    async refreshAccounts() {
        this.accountsData = await this.accountsService.getAccounts();
    }

    async ping() {
        this.responseData = await this.accountsService.ping();
        if (this.responseData) {
            setTimeout(() => this.responseData = null, 1000);
        }
    }
}
