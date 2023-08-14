import { Component, OnInit } from '@angular/core';
import { AccountsService } from './accounts.service';
import { Account } from './account';
import { from } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'one-up-client';

    responseData: any | null = null;
    accountsData: any | null = null;


    constructor(private accountsService: AccountsService) { }

    ngOnInit(): void {
        this.refreshAccounts();
    }

    async refreshAccounts() {
        this.accountsData = await this.accountsService.refresh();
        console.log(this.accountsData.data);
    }

    async ping() {
        this.responseData = await this.accountsService.ping();
        if (this.responseData) {
            setTimeout(() => this.responseData = null, 1000);
        }
    }
}
