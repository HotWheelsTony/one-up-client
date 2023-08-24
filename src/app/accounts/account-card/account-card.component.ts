import { Component, Input } from '@angular/core';
import { Account } from '../account';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent {

    @Input()
    public account!: Account;

}
