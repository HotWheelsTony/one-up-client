import { Component, Input } from '@angular/core';
import { TransactionResource } from 'src/app/models/transaction-resource.interface';

@Component({
    selector: 'app-transaction-card',
    templateUrl: './transaction-card.component.html',
    styleUrls: ['./transaction-card.component.css']
})
export class TransactionCardComponent {
    @Input()
    public transaction!: TransactionResource;
}
