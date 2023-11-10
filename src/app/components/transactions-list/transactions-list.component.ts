import { Component, Input, OnChanges } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AccountResource } from 'src/app/models/resources/account-resource.interface';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
    selector: 'app-transactions-list',
    templateUrl: './transactions-list.component.html',
    styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnChanges {

    @Input()
    public nextPageUrl?: string;

    @Input()
    public account?: AccountResource;

    @Input()
    public transactions!: TransactionResource[];


    constructor(private _transactionsService: TransactionsService) { }


    ngOnChanges(): void {
        if (this.transactions && this.account) {
            this.transactions = this.calculateRemainingBalances(this.account, this.transactions);
        }
    }


    private async loadMoreTransactions() {
        if (this.nextPageUrl && this.account) {
            const response = (await lastValueFrom(this._transactionsService.getNextPage(this.nextPageUrl)));
            const nextPageTxns = response.data;
            this.nextPageUrl = response.links?.next;

            this.transactions = this.calculateRemainingBalances(this.account, this.transactions.concat(nextPageTxns));
        }
    }


    private calculateRemainingBalances(account: AccountResource, transactions: TransactionResource[]): TransactionResource[] {
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];

            //ignore balances we've already calculated
            if (transaction.remainingBalance) {
                continue;
            }

            if (i === 0) {
                transaction.remainingBalance = account.attributes.balance.valueInBaseUnits / 100;
            } else {
                const nextChronoligicalTransaction = transactions[i - 1];
                transaction.remainingBalance = nextChronoligicalTransaction.remainingBalance - (nextChronoligicalTransaction.attributes.amount.valueInBaseUnits / 100);
            }
        }
        return transactions;
    }


    public async handleScroll(event: any) {
        await this.loadMoreTransactions();
        event.target.complete();
    }


}
