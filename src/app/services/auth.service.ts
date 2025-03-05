import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly _baseUrl: string = 'https://api.up.com.au/api/v1/';
    private _cachedToken: string | null = null;


    constructor(private _http: HttpClient) { }

    public createHeaders(): HttpHeaders {
        const token = this._cachedToken ?? localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }

    public validateToken(token: string | null): Observable<boolean> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this._http.get<{
            meta: {
                id: string;
                statusEmoji: string;
            }
        }>(`${this._baseUrl}/util/ping`, { headers }).pipe(
            map((response) => {
                return true;
            }),
            catchError((error) => {
                console.log(error);
                return of(false);
            })
        );
    }

}
