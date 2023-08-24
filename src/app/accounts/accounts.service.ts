import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class AccountsService {


    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1/accounts';
    private readonly _tokenPath: string = 'assets/token.txt';
    private _cachedToken: string | null = null;


    constructor(
        private http: HttpClient
    ) { }


    private getToken(): Observable<string> {
        if (this._cachedToken) {
            return from([this._cachedToken]);
        }

        return this.http.get(this._tokenPath, { responseType: 'text' }).pipe(
            switchMap((token) => {
                this._cachedToken = token;
                return from([token])
            })
        );
    }

    private amendHeaders(): Observable<HttpHeaders> {
        return this.getToken().pipe(
            switchMap((token) => {
                return from([new HttpHeaders().set('Authorization', `Bearer ${token}`)]);
            })
        );
    }

    public getAccounts(): Observable<any> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get(`${this._baseUrl}`, { headers })
            })
        );
    }

    public getAccountById(id: string): Observable<any> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get(`${this._baseUrl}/${id}`, { headers });
            })
        );
    }

    public getAccountTransactions(accountId: string): Observable<any> {
        return this.amendHeaders().pipe(
            switchMap((headers) => {
                return this.http.get(`${this._baseUrl}/${accountId}/transactions`, { headers });
            })
        );
    }

}
