import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class AccountsService {

    private readonly _baseUrl = 'https://api.up.com.au/api/v1';
    private _cachedToken: string | null = null;

    constructor(
        private http: HttpClient
    ) { }

    private async amendHeaders(): Promise<HttpHeaders> {
        if (this._cachedToken === null) {
            this._cachedToken = await lastValueFrom(this.http.get('assets/token.txt', { responseType: 'text' }));
        }
        return new HttpHeaders().set('Authorization', `Bearer ${this._cachedToken}`);
    }

    async refresh() {
        const headers = await this.amendHeaders();
        return lastValueFrom(this.http.get(this._baseUrl + '/accounts', { headers }));
    }

    async ping(): Promise<Object> {
        const headers = await this.amendHeaders();
        return lastValueFrom(this.http.get(this._baseUrl + '/util/ping', { headers }));
    }

}
