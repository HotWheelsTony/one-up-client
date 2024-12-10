import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';

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
    private _cachedToken: string | null = null;


    constructor(private _http: HttpClient) { }

    public createHeaders(): HttpHeaders {
        const token = this._cachedToken ?? localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }

    public ping(): Observable<PingResponse> {
        const headers = this.createHeaders();
        return this._http.get<PingResponse>(`${this._baseUrl}/util/ping`, { headers }).pipe(
            map((response) => ({
                meta: response.meta
            }))
        );
    }

    public validateToken(token: string): Observable<boolean> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this._http.get<PingResponse>(`${this._baseUrl}/util/ping`, { headers }).pipe(
            map((response) => {
                console.log('Token validated successfully!: ', response);
                return true;
            }),
            catchError((error) => {
                console.log(error);
                return of(false);
            })
        );
    }

}
