import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountResource } from '../models/resources/account-resource.interface';

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
    subtitle?: string;

    @Input()
    account?: AccountResource;

    @Input()
    currency?: string;

    @Input()
    backButton: boolean = false;

    @Input()
    moreOptions: boolean = false;


    public goBack(): void {
        this._router.navigate(['..']);
    }

}
