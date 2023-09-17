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
    private _daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    private _monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    public since: Date = new Date();
    public until: Date = new Date();

    public response?: ApiResponse<TransactionResource | TransactionResource[]>;
    public account?: AccountResource;

    public offset: number = 0;
    public timeframeEnum = Timeframe;
    public timeframe: Timeframe = Timeframe.week;
    public chartData: [string, number][] = [];
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


    private getAccount(id: string) {
        this._accountSubscription = this._accountsService.getAccount(id).subscribe(
            (response) => {
                this.account = response.data;
                this.getTransactionsInDateRange(this.timeframe, this.offset);
            }
        );
    }


    private updateChart() {
        //map the transaction array to a map<dayofweek/dayofmonth/monthofyear, amount spent>
        const spendingMap = this.mapTransactions(this._transactions);

        //convert the map to a 2d array for the char to consume the data
        const spendingArray = Array.from(spendingMap);

        //set the total spend for this period
        this.periodTotal = Array.from(spendingMap.values()).reduce((sum, num) => sum + num, 0);

        //set the array as the chart data
        this.chartData = spendingArray;

        //redraw chart
        this.drawChart();
    }


    private mapTransactions(transactions: TransactionResource[]): Map<string, number> {
        //set all entries in chart data to 0
        const totals = this.initializeChartData();

        for (const transaction of transactions) {
            const txnAmount = transaction.attributes.amount.valueInBaseUnits;
            const txnDate = transaction.attributes.createdAt;
            const isTransfer: boolean = transaction.attributes.description.toLowerCase().includes('transfer');

            //ignore positive transactions and internal transfers for now
            if (txnAmount > 0 || isTransfer) {
                continue;
            }

            let currtotal;
            let key;

            switch (this.timeframe) {
                case Timeframe.week:
                    // minus 1 becasue we're using monday as the first day of the week
                    key = this._daysOfWeek[(new Date(txnDate).getDay() + 6) % 7];
                    break;
                case Timeframe.month:
                    key = new Date(txnDate).getDate().toString();
                    break;
                case Timeframe.year:
                    key = this._monthsOfYear[new Date(txnDate).getMonth()];
                    break;
                default:
                    console.log('Invalid timeframe: ', this.timeframe);
                    return totals;
            }

            currtotal = totals.get(key);

            if (currtotal !== undefined) {
                totals.set(key, currtotal + Math.abs(txnAmount / 100));
            }
        }

        return totals;
    }


    private initializeChartData(): Map<string, number> {
        const newChartData = new Map<string, number>();

        switch (this.timeframe) {
            case Timeframe.week:
                for (const day of this._daysOfWeek) {
                    newChartData.set(day, 0);
                }
                return newChartData;
            case Timeframe.month:
                for (let i = 0; i < this.until.getDate(); i++) {
                    newChartData.set(i.toString(), 0);
                }
                return newChartData;
            case Timeframe.year:
                for (const month of this._monthsOfYear) {
                    newChartData.set(month, 0);
                }
                return newChartData;
            default:
                console.log("Invalid timeframe: ", this.timeframe);
                return newChartData;
        }
    }


    //time frame can be week month of year, offset represents how far back the timeframe is, i.e. last week or the week before
    private getTransactionsInDateRange(timeframe: Timeframe, offset: number) {
        const since = new Date();
        let until = new Date();

        switch (timeframe) {
            case Timeframe.week:
                since.setDate(since.getDate() - ((since.getDay() + 6) % 7) - (offset * 7));
                until = new Date(since);
                until.setDate(until.getDate() + 6);
                break;
            case Timeframe.month:
                since.setDate(1);
                since.setMonth(since.getMonth() - offset);
                until.setMonth(since.getMonth() + 1)
                until.setDate(0);
                break;
            case Timeframe.year:
                since.setFullYear(since.getFullYear() - offset);
                since.setMonth(0);
                since.setDate(1);
                until.setFullYear(since.getFullYear() + 1);
                until.setMonth(0);
                until.setDate(0);
                break;
            default:
                console.log("Invalid timeframe: ", timeframe);
                return;
        }

        since.setHours(0, 0, 0, 0);
        this.since = since;
        this.until = until;

        if (this.account) {
            this._transactionsSubscription = this._transactionsService.listAccountTransactions(this.account?.id, '100',
                since.toISOString(), until.toISOString()).subscribe(
                    (response) => {
                        this.response = response;
                        this._transactions = response.data;

                        if (response.links?.next) {
                            this.getNextPage(response.links.next);
                        } else {
                            this.updateChart();
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
                    this.updateChart();
                }

            }
        );
    }


    public setTimeframe(tf: Timeframe) {
        this.timeframe = tf;
        this.offset = 0;
        this.getTransactionsInDateRange(this.timeframe, this.offset);
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
        google.charts.load('current', { packages: ['coreChart'] });
        google.charts.setOnLoadCallback(() => this.drawChart());
    }


    drawChart() {
        const data = new google.visualization.DataTable();

        data.addColumn('string', 'Day');
        data.addColumn('number', 'Amount spent');

        data.addRows(this.chartData);

        const barColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-grey');
        const globalFont = getComputedStyle(document.documentElement).getPropertyValue('--global-font');
        const tickFontSize = getComputedStyle(document.documentElement).getPropertyValue('--font-size-small');



        const options = {
            colors: [barColor],
            legend: 'none',
            backgroundColor: 'transparent',

            hAxis: {
                textStyle: {
                    color: barColor,
                    font: 'Roboto',
                    fontSize: 10,
                }
            },
            vAxis: {
                format: 'currency',
                textStyle: {
                    color: barColor,
                    font: 'Roboto',
                    fontSize: 10,
                }
            },
        }

        const chart = new google.visualization.ColumnChart(document.getElementById('spending-chart'));

        chart.draw(data, options);
    }


}
