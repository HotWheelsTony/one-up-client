import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {

    @Input()
    title!: string;

    @Input()
    subtitle: string | null = null;

    @Input()
    balance: number | null = null;

    @Input()
    currency: string | null = null;

}
