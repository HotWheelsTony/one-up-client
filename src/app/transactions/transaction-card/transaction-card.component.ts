import { Component, Input } from '@angular/core';
import { Transaction } from '../transaction';

@Component({
    selector: 'app-transaction-card',
    templateUrl: './transaction-card.component.html',
    styleUrls: ['./transaction-card.component.css']
})
export class TransactionCardComponent {
    @Input()
    public transaction!: Transaction;
}
