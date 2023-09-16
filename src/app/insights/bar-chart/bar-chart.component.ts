import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { AccountResource } from 'src/app/models/resources/account-resource.interface';
import { ApiResponse } from 'src/app/models/api-response.interface';
declare var google: any;

enum Timeframe {
    week = 'Week',
    month = 'Month',
    year = 'Year'
}

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnDestroy {

    private _transactions: TransactionResource[] = [];
    private _accountSubscription?: Subscription;
    private _transactionsSubscription?: Subscription;
    private _nextPageSubscription?: Subscription;
    private _dayNames: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    public since: Date = new Date();
    public until: Date = new Date();

    public response?: ApiResponse<TransactionResource | TransactionResource[]>;
    public account?: AccountResource;
    public offset: number = 0;
    public timeframeEnum = Timeframe;
    public timeframe: Timeframe = Timeframe.week;
    public chartData: Map<string, number> = new Map();
    public periodTotal: number = 0;

    constructor(private _transactionsService: TransactionsService, private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const accountId = this._activatedRoute.snapshot.paramMap.get('accountId');
        if (accountId) {
            this.getAccount(accountId);
        }

        this.loadGoogleCharts();
    }

    ngOnDestroy(): void {
        this._accountSubscription?.unsubscribe();
        this._transactionsSubscription?.unsubscribe();
        this._nextPageSubscription?.unsubscribe();
    }

    private setChartData(spendMap: Map<string, number>) {
        this.periodTotal = Array.from(spendMap.values()).reduce((sum, num) => sum + num, 0);
        this.chartData = spendMap;
        //redraw chart
        this.drawChart();
    }

    private getAccount(id: string) {
        this._accountSubscription = this._accountsService.getAccount(id).subscribe(
            (response) => {
                this.account = response.data;
                this.getTransactionsInDateRange(this.timeframe, this.offset);
            }
        );
    }

    private transformData(transactions: TransactionResource[]): Map<string, number> {
        const dailyTotals = new Map<string, number>();
        for (const day of this._dayNames) {
            dailyTotals.set(day, 0);
        }

        for (const transaction of transactions) {
            const transactionAmount = transaction.attributes.amount.valueInBaseUnits;
            const isTransfer: boolean = transaction.attributes.description.toLowerCase().includes('transfer');

            //ignore positive transactions and internal transfers for now
            if (transactionAmount > 0 || isTransfer) {
                continue;
            }

            //minus 1 becasue we're using monday as the first day of the week
            const day = this._dayNames[new Date(transaction.attributes.createdAt).getDay() - 1];
            const dailyTotal = dailyTotals.get(day);

            if (dailyTotal !== undefined) {
                dailyTotals.set(day, dailyTotal + Math.abs(transactionAmount / 100));
            }

        }

        return dailyTotals;
    }

    //time frame can be week month of year, offset represents how far back the timeframe is, i.e. last week or the week before
    private getTransactionsInDateRange(timeframe: string, offset: number) {
        let since = new Date();
        let until = new Date();

        if (timeframe === Timeframe.week) {
            since.setDate(since.getDate() - (since.getDay() - 1) - (offset * 7));
            since.setHours(0, 0, 0, 0);

            until = new Date(since);
            until.setDate(until.getDate() + 6);

        }

        this.since = since;
        this.until = until;

        // console.log(since);
        // console.log(until);

        if (this.account) {
            this._transactionsSubscription = this._transactionsService.listAccountTransactions(this.account?.id, '100',
                since.toISOString(), until.toISOString()).subscribe(
                    (response) => {
                        this.response = response;
                        this._transactions = response.data;

                        if (response.links?.next) {
                            this.getNextPage(response.links.next);
                        } else {
                            this.setChartData(this.transformData(this._transactions));
                        }
                    }
                );
        }
    }

    private getNextPage(url: string) {
        this._nextPageSubscription = this._transactionsService.getNextPage(url, '100').subscribe(
            (response) => {
                this.response = response;
                this._transactions = this._transactions?.concat(response.data);

                if (response.links?.next) {
                    this.getNextPage(response.links.next);
                } else {
                    this.setChartData(this.transformData(this._transactions));
                }

            }
        );
    }

    public nextPeriod() {
        this.offset = this.offset > 0 ? this.offset - 1 : this.offset;
        this.getTransactionsInDateRange(this.timeframe, this.offset);
    }

    public previousPeriod() {
        this.offset++;
        this.getTransactionsInDateRange(this.timeframe, this.offset);
    }


    loadGoogleCharts() {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => this.drawChart());
    }

    drawChart() {
        const data = new google.visualization.DataTable();

        data.addColumn('string', 'Day');
        data.addColumn('number', 'Amount spent');
        data.addRows(Array.from(this.chartData));
        console.log(Array.from(this.chartData));


        const options = {
            legend: 'none',
            hAxis: {

            },
            vAxis: {
                format: 'currency'
            }
        }

        const chart = new google.visualization.ColumnChart(
            document.getElementById('spending-chart')
        );

        chart.draw(data, options);
    }
}
