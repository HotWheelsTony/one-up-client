import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { Subscription } from 'rxjs';
import { AccountResource } from '../models/resources/account-resource.interface';
import { TransactionResource } from '../models/resources/transaction-resource.interface';
import { ApiResponse } from '../models/api-response.interface';
import { TransactionsService } from '../services/transactions.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

    public response?: ApiResponse<TransactionResource | TransactionResource[]>;
    public account?: AccountResource;
    public transactions: TransactionResource[] = [];

    private _accountSubscription?: Subscription;
    private _transactionsSubscription?: Subscription;
    private _nextPageSubscription?: Subscription;
    private _shouldLoadNextPage = true;


    public menuItems = [{
        name: 'Search',
        function: () => this._router.navigate(['']),
    },
    {
        name: 'Insights',
        function: () => this._router.navigate([this.account?.id, 'insights']),
    },
    ];


    constructor(private _router: Router, private _transactionsService: TransactionsService, private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }

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

    private getAccount(id: string) {
        this._accountSubscription = this._accountsService.getAccount(id).subscribe(
            (response) => {
                this.account = response.data;
                this.listTransactions(this.account.id);
            }
        );
    }

    private listTransactions(accountId: string) {
        this._transactionsSubscription = this._transactionsService.listAccountTransactions(accountId).subscribe(
            (response) => {
                this.response = response;
                this.transactions = this.calculateRemainingBalances(this.account!, response.data);
            }
        );
    }

    private loadMoreTransactions(url: string) {
        this._nextPageSubscription = this._transactionsService.getNextPage(url).subscribe(
            (response) => {
                this.response = response;
                this.transactions = this.calculateRemainingBalances(this.account!, this.transactions.concat(response.data));
                this._shouldLoadNextPage = true;

            }
        );
    }

    @HostListener('window:scroll', ['$event'])
    public onScroll() {
        const nextPageUrl = this.response?.links?.next;
        const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
        const max = document.documentElement.scrollHeight;
        const scrollPercent = pos / max;

        // 95% scrolled down the page
        if (this._shouldLoadNextPage && scrollPercent > 0.95 && nextPageUrl) {
            this._shouldLoadNextPage = false;
            this.loadMoreTransactions(nextPageUrl)
        }
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


}
