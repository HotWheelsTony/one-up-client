import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    private readonly _tokenPath: string = 'assets/token.txt';
    private _cachedToken?: string;


    constructor(private http: HttpClient) { }

    private readToken(): Observable<string> {
        if (this._cachedToken) return of(this._cachedToken);

        return this.http.get(this._tokenPath, { responseType: 'text' }).pipe(
            switchMap((token) => {
                this._cachedToken = token;
                return of(token);
            })
        );
    }

    private createHeaders(): Observable<HttpHeaders> {
        return this.readToken().pipe(
            switchMap((token) => {
                return of(new HttpHeaders().set('Authorization', `Bearer ${token}`));
            })
        );
    }

}
