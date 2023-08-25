import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class AppHeaderComponent {

    constructor(private _router: Router) { }

    @Input()
    title!: string;

    @Input()
    subtitle: string | null = null;

    @Input()
    balance: number | null = null;

    @Input()
    currency: string | null = null;

    @Input()
    includeBackButton: boolean = false;


    public goBack(): void {
        this._router.navigate(['..']);
    }

}
