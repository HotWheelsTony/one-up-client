import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {

    const router: Router = inject(Router);
    const auth: AuthService = inject(AuthService);
    const token = localStorage.getItem('token')

    return auth.validateToken(token).pipe(
        map((validated) => {
            if (validated) {
                return true;
            } else {
                return router.createUrlTree(['/']);
            }
        })
    );
};
