import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response.interface';
import { AccountResource } from 'src/app/models/resources/account-resource.interface';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
    selector: 'app-insights',
    templateUrl: './insights.component.html',
    styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit, OnDestroy {

    public response?: ApiResponse<TransactionResource | TransactionResource[]>;
    public account?: AccountResource;


    private _accountSubscription?: Subscription;


    constructor(private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const accountId = this._activatedRoute.snapshot.paramMap.get('accountId');
        if (accountId) {
            this.getAccount(accountId);
        }
    }

    ngOnDestroy(): void {
        this._accountSubscription?.unsubscribe();
    }

    private getAccount(id: string) {
        this._accountSubscription = this._accountsService.getAccount(id).subscribe(
            (response) => {
                this.account = response.data;
            }
        );
    }

}
