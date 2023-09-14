import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response.interface';
import { AccountResource } from 'src/app/models/resources/account-resource.interface';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
    selector: 'app-insights',
    templateUrl: './insights.component.html',
    styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit, OnDestroy {

    public response?: ApiResponse<TransactionResource | TransactionResource[]>;
    public account?: AccountResource;
    public transactions: TransactionResource[] = [];

    private _accountSubscription?: Subscription;
    private _transactionsSubscription?: Subscription;
    private _nextPageSubscription?: Subscription;

    constructor(private _transactionsService: TransactionsService, private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const accountId = this._activatedRoute.snapshot.paramMap.get('accountId');
        if (accountId) {
            this.getAccount(accountId);
        }
    }

    ngOnDestroy(): void {
        this._accountSubscription?.unsubscribe();
        this._transactionsSubscription?.unsubscribe();
        this._nextPageSubscription?.unsubscribe();
    }

    private getAccount(id: string) {
        this._accountSubscription = this._accountsService.getAccount(id).subscribe(
            (response) => {
                this.account = response.data;
                this.getAllTransactions(this.account.id);
            }
        );
    }

    private getAllTransactions(accountId: string) {
        this._transactionsSubscription = this._transactionsService.listAccountTransactions(accountId, '50').subscribe(
            (response) => {
                this.response = response;
                this.transactions = response.data;

                if (response.links?.next) {
                    this.getNextPage(response.links.next);
                }
            }
        );
    }

    private getNextPage(url: string) {
        this._nextPageSubscription = this._transactionsService.getNextPage(url, '50').subscribe(
            (response) => {
                this.response = response;
                this.transactions = this.transactions?.concat(response.data);

                if (response.links?.next) {
                    this.getNextPage(response.links.next);
                }
            }
        );
    }

}
