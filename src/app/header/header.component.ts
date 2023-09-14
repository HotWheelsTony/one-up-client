import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { AccountResource } from '../models/resources/account-resource.interface';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class AppHeaderComponent {

    constructor(private _location: Location) { }

    @Input()
    title?: string;

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

    @Input()
    menuItems?: {
        name: string;
        function: Function;
    }[];


    public goBack(): void {
        this._location.back();
    }

}
