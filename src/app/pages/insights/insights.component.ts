import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { DateTime, Duration } from 'luxon';
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
    public txns: TransactionResource[] = [];
    public account?: AccountResource;
    public periodDuration: Duration = Duration.fromObject({ days: 1 });

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

        const response = (await lastValueFrom(this._txnsService.listAccountTransactions(this.account.id, '100', since, until)));
        this.txns = response.data;
        // this.nextPageUrl = response.links?.next as string;
    }


    public sumTxns(txnsArr: TransactionResource[]): number {
        if (txnsArr === null || txnsArr.length === 0) {
            return 0;
        }
        return Math.round(txnsArr.map(x => x.attributes.amount.valueInBaseUnits)
            .reduce((prev, curr) => prev + curr) / 100);
    }


    public getMoneyIn(): number {
        if (this.txns === null || this.txns.length === 0) {
            return 0;
        }

        const filtered = this.txns.filter(x => {
            return x.attributes.amount.valueInBaseUnits > 0
                && x.attributes.transactionType !== 'Transfer';
        })

        if (filtered.length > 0) {
            return filtered.map(x => x.attributes.amount.valueInBaseUnits)
                .reduce((prev, curr) => prev + curr) / 100;
        }

        return 0;
    }


    public getCharges(): TransactionResource[] {
        const chargeTypes = ['Purchase', null];
        return this.getTxnsByType(chargeTypes);
    }


    public getPayments(): TransactionResource[] {
        const paymentTypes = ['Pay anyone', 'Payment'];
        return this.getTxnsByType(paymentTypes);
    }


    public getTxnsByType(filter: (string | null)[]): TransactionResource[] {
        return this.txns.filter(x => filter.includes(x.attributes.transactionType));
    }


    public changePeriod(change: number) {
        this.since.update(value => value.plus({ days: change }));
        this.until.update(value => value.plus({ days: change }));
    }


    public scrollToTop() {
        this.content.scrollToTop(700);
    }
}
