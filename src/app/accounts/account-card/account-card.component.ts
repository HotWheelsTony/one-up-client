import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent {
    @Input()
    displayName: string | null = null;

    @Input()
    value: number | null = null;
}
