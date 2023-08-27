import { Component, Input } from '@angular/core';
import { AccountResource } from 'src/app/models/account-resource.interface';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent {

    @Input()
    public account!: AccountResource;

}
