import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent {
    @Input()
    public displayName: string | null = null;

    @Input()
    public currency: string | null = null;

    @Input()
    public value: number | null = null;
}
