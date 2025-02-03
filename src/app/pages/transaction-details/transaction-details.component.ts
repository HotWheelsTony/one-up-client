import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionResource } from 'src/app/models/resources/transaction-resource.interface';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
    selector: 'app-transaction-details',
    templateUrl: './transaction-details.component.html',
    styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

    public transaction: TransactionResource | null = null;


    constructor(private _activatedRoute: ActivatedRoute, private _txnService: TransactionsService) { }

    ngOnInit(): void {
        const txnId = this._activatedRoute.snapshot.paramMap.get('transactionId');
        if (txnId) {
            this._txnService.getTransaction(txnId).subscribe((txn) => {
                this.transaction = txn.data;
            })
        }

    }


}
