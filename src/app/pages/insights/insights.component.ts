import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { DateTime, DateTimeUnit } from 'luxon';
import { lastValueFrom, Subscription } from 'rxjs';
import { AccountResource } from 'src/app/models/resources/account-resource.interface';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
    selector: 'app-insights',
    templateUrl: './insights.component.html',
    styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {

    @ViewChild(IonContent) content!: IonContent;

    public since = signal(DateTime.now().startOf('day'));
    public until = signal(DateTime.now().endOf('day'));
    public txns: TransactionResource[] | null = null;
    public account?: AccountResource;
    public periodDuration: string = 'day';

    private _txnsSubscription?: Subscription;
    private _routeParamsSubscription?: Subscription;


    constructor(private _txnsService: TransactionsService, private _activatedRoute: ActivatedRoute, private _accountsService: AccountsService) {
        effect(() => {
            this.loadTransactions(this.since(), this.until());
        });
    }


    ngOnInit(): void {
        this._routeParamsSubscription = this._activatedRoute.paramMap.subscribe(
            async (routeParams) => {
                const accountId = routeParams.get('accountId');

                if (accountId) {
                    this.account = (await lastValueFrom(this._accountsService.getAccount(accountId))).data;
                    this.loadTransactions(this.since(), this.until());
                }
            }
        );
    }


    ngOnDestroy(): void {
        this._routeParamsSubscription?.unsubscribe();
        this._txnsSubscription?.unsubscribe();
    }


    private async loadTransactions(since: DateTime, until: DateTime) {
        if (!this.account) {
            return;
        }

        this.txns = null;

        let response = (await lastValueFrom(this._txnsService.listAccountTransactions(this.account.id, since, until, 100)));
        let txns = response.data;
        let nextPageUrl = response.links?.next as string;

        while (nextPageUrl) {
            response = await lastValueFrom(this._txnsService.getNextPage(nextPageUrl, 100));
            txns = txns.concat(response.data);
            nextPageUrl = response.links?.next as string;
        }

        this.txns = txns;
    }


    public sumTxns(txnsArr: TransactionResource[]): number {
        if (txnsArr === null || txnsArr.length === 0) {
            return 0;
        }

        return Math.round(txnsArr.map(x => x.attributes.amount.valueInBaseUnits)
            .reduce((prev, curr) => prev + curr) / 100);
    }


    public getMoneyIn(): TransactionResource[] {
        if (this.txns) {
            return this.txns.filter(x => {
                return x.attributes.amount.valueInBaseUnits > 0
                    && x.attributes.transactionType !== 'Transfer';
            });
        }
        return [];
    }


    public getCharges(): TransactionResource[] {
        const chargeTypes = ['Purchase', 'International Purchase', 'Direct Debit', null];
        return this.getTxnsByType(chargeTypes);
    }


    public getPayments(): TransactionResource[] {
        const paymentTypes = ['Pay anyone', 'Payment'];
        return this.getTxnsByType(paymentTypes);
    }


    public getTxnsByType(filter: (string | null)[]): TransactionResource[] {
        if (this.txns) {
            return this.txns.filter(x => filter.includes(x.attributes.transactionType) && x.attributes.amount.valueInBaseUnits < 0);
        }
        return [];
    }


    public changePeriod(change: number) {
        const changeObj = {
            days: 0,
            weeks: 0,
            months: 0,
        }

        switch (this.periodDuration) {
            case 'week':
                changeObj.weeks = change;
                break;
            case 'day':
                changeObj.days = change;
                break;
            case 'month':
                changeObj.months = change;
                break;
            default:
                return;
        };


        if (this.until().plus(changeObj) > DateTime.now().endOf(this.periodDuration)) {
            return;
        }

        this.since.update(value => value.plus(changeObj));
        this.until.update(value => value.plus(changeObj));
    }


    public changePeriodDuration(event: any) {
        this.periodDuration = event.detail.value;

        this.since.update(() => this.until().startOf(this.periodDuration as DateTimeUnit));
        this.until.update(() => this.since().endOf(this.periodDuration as DateTimeUnit));

        if (this.since() > DateTime.now()) {
            this.since.update(() => DateTime.now().startOf(this.periodDuration as DateTimeUnit));
            this.until.update(() => DateTime.now().endOf(this.periodDuration as DateTimeUnit));
        }

        this.changePeriod(0);
    }


    public scrollToTop() {
        this.content.scrollToTop(600);
    }
}
