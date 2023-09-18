import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, map, catchError } from 'rxjs';

interface PingResponse {
    meta: {
        id: string;
        statusEmoji: string;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1/';
    private readonly _tokenPath: string = 'assets/token.txt';
    private _cachedToken: string | null = null;



    constructor(private _http: HttpClient) { }

    private readToken(): Observable<string | null> {
        return of(localStorage.getItem('token'));
    }

    public createHeaders(): Observable<HttpHeaders> {
        return this.readToken().pipe(
            switchMap((token) => {
                return of(new HttpHeaders().set('Authorization', `Bearer ${token}`));
            })
        );
    }

    public createHeaders2(): HttpHeaders {
        if (!this._cachedToken) {
            this._cachedToken = localStorage.getItem('token');
        }
        return new HttpHeaders().set('Authorization', `Bearer ${this._cachedToken}`)
    }

    public ping(): Observable<PingResponse> {
        const headers = this.createHeaders2();
        return this._http.get<PingResponse>(`${this._baseUrl}/util/ping`, { headers }).pipe(
            map((response) => ({
                meta: response.meta
            }))
        );
    }

    public validateToken(token: string): Observable<boolean> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this._http.get<PingResponse>(`${this._baseUrl}/util/ping`, { headers }).pipe(
            map((_) => {
                return true;
            }),
            catchError((error) => {
                return of(false);
            })
        );
    }

}
