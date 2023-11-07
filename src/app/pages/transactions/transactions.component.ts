import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { AccountResource } from '../../models/resources/account-resource.interface';
import { TransactionResource } from '../../models/resources/transaction-resource.interface';
import { TransactionsService } from '../../services/transactions.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

    public account?: AccountResource;
    public transactions: TransactionResource[] = [];
    public displayTransactions: TransactionResource[] = [...this.transactions];
    public scrollEndMessage: string | null = null;
    public scrollEndSpinner: string = 'crescent';
    public showSearch: boolean = false;

    private _routeParamsSubscription?: Subscription;
    private _nextpageUrl?: string;

    public menuItems = [{
        name: 'Search',
        function: () => this._router.navigate(['']),
    },
    {
        name: 'Insights',
        function: () => this._router.navigate(['accounts', this.account?.id, 'insights']),
    },
    ];


    constructor(private _router: Router, private _transactionsService: TransactionsService, private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }


    ngOnInit(): void {
        this._routeParamsSubscription = this._activatedRoute.paramMap.subscribe(
            async (routeParams) => {
                const accountId = routeParams.get('accountId');

                if (accountId) {
                    this.account = (await lastValueFrom(this._accountsService.getAccount(accountId))).data;
                    const response = (await lastValueFrom(this._transactionsService.listAccountTransactions(accountId)));
                    this.transactions = this.calculateRemainingBalances(this.account, response.data);
                    this.displayTransactions = this.transactions;

                    this._nextpageUrl = response.links?.next as string;
                }
            }
        );
    }


    ngOnDestroy(): void {
        this._routeParamsSubscription?.unsubscribe();
    }


    public toggleAccordion(transaction: TransactionResource) {
        //collapse all class=card
        const id = transaction.id;

        //toggle clicked card
        document.getElementById(id)?.classList.toggle('active');

        //collapse all active cards, unless it's the clicked card
        const all = document.getElementsByClassName('active');

        for (let i = 0; i < all.length; i++) {
            if (all[i].id !== id) {
                all[i].classList.remove('active')
            }

        }
    }


    public async loadMoreTransactions(event: any) {
        if (!this._nextpageUrl) {
            this.scrollEndSpinner = 'none';
            this.scrollEndMessage = 'End of transactions'
            return;
        }

        const response = (await lastValueFrom(this._transactionsService.getNextPage(this._nextpageUrl)));
        const nextPageTxns = response.data;
        this._nextpageUrl = response.links?.next;

        this.transactions = this.calculateRemainingBalances(this.account!, this.transactions.concat(nextPageTxns));
        this.displayTransactions = this.transactions;
        event.target.complete()
    }


    private calculateRemainingBalances(account: AccountResource, transactions: TransactionResource[]): TransactionResource[] {
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            if (i === 0) {
                transaction.remainingBalance = account.attributes.balance.valueInBaseUnits / 100;
            } else {
                const nextChronoligicalTransaction = transactions[i - 1];
                transaction.remainingBalance = nextChronoligicalTransaction.remainingBalance - (nextChronoligicalTransaction.attributes.amount.valueInBaseUnits / 100);
            }
        }
        return transactions;
    }


    public handleSearch(event: any) {
        const query = event.target.value.toLowerCase();
        this.displayTransactions = this.transactions.filter(
            (e) => {
                return e.attributes.description.toLowerCase().includes(query);
            }
        );
    }


    public toggleSearchBar() {
        this.showSearch = !this.showSearch;
    }


}
