import { Injectable } from '@angular/core';
import { Account } from './accounts/account';
import { Observable } from 'rxjs'

interface IRouteParameters {
    Account?: Account;
}

@Injectable({
    providedIn: 'root'
})
export class RouteParametersService {

    // public readonly RouteParameters: Observable<IRouteParameters>;
    public RouteParametersSnapshot: IRouteParameters = {};

    constructor() { }

    // getRouteParams(): IRouteParameters {
    //     // return null;
    // }
}
