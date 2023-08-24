import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from '../account';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

    public id: string | null = '';

    @Input()
    public account!: Account;

    constructor(private _activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const acc = this._activatedRoute.snapshot.paramMap
        console.log(acc);
    }
}
