import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs'
import { AccountResource } from '../models/resources/account-resource.interface';
import { ApiResponse } from '../models/api-response.interface';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {


    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1/accounts';


    constructor(private _http: HttpClient, private _authService: AuthService) { }

    public listAccounts(): Observable<ApiResponse<AccountResource[]>> {
        const headers = this._authService.createHeaders();
        return this._http.get<ApiResponse<AccountResource[]>>(`${this._baseUrl}`, { headers }).pipe(
            map((response) => ({
                data: response.data as AccountResource[],
                links: response.links
            }))
        );

    }

    public getAccount(id: string): Observable<ApiResponse<AccountResource>> {
        const headers = this._authService.createHeaders();
        return this._http.get<ApiResponse<AccountResource>>(`${this._baseUrl}/${id}`, { headers }).pipe(
            map((response) => ({
                data: response.data as AccountResource
            }))
        );

    }

}
