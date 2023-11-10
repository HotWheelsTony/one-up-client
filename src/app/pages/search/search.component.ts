import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { Subscription, lastValueFrom } from 'rxjs';
import { AccountResource } from 'src/app/models/resources/account-resource.interface';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    public searchForm: FormGroup;
    public account?: AccountResource;
    public transactions: TransactionResource[] = [];
    public nextPageUrl?: string;

    private _searchFormSubscription?: Subscription;
    private _routeParamsSubscription?: Subscription;

    constructor(private _formBuilder: FormBuilder, private _transactionsService: TransactionsService, private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) {
        this.searchForm = this._formBuilder.group({
            query: [],
            since: [DateTime.now().minus({ weeks: 1 }).toISO()],
            until: [DateTime.now().toISO()],
            fromAmount: [],
            toAmount: [],
        });
    }


    ngOnInit(): void {
        this._routeParamsSubscription = this._activatedRoute.paramMap.subscribe(
            async (routeParams) => {
                const accountId = routeParams.get('accountId');
                if (accountId) {
                    this.account = (await lastValueFrom(this._accountsService.getAccount(accountId))).data;
                    this.loadTransactions();
                }
            }
        );

        this._searchFormSubscription = this.searchForm.valueChanges.subscribe(
            () => {
                //use values from form to call update and filter methods here
                this.loadTransactions();
            }
        );
    }


    ngOnDestroy(): void {
        this._searchFormSubscription?.unsubscribe();
        this._routeParamsSubscription?.unsubscribe();
    }


    private async loadTransactions() {
        if (!this.account) {
            return;
        }

        const since = DateTime.fromISO(this.searchForm.value.since).startOf('day').toISO();
        const until = DateTime.fromISO(this.searchForm.value.until).endOf('day').toISO();

        if (!since || !until) {
            return;
        }

        const response = (await lastValueFrom(this._transactionsService.listAccountTransactions(this.account.id, '20', since, until)));
        this.nextPageUrl = response.links?.next;
        this.transactions = response.data;

    }





    // public handleSearch(event: any) {
    //     const query = event.target.value.toLowerCase();
    //     this.displayTransactions = this.transactions.filter(
    //         (e) => {
    //             return e.attributes.description.toLowerCase().includes(query);
    //         }
    //     );
    // }

}
