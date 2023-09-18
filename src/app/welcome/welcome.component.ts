import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {

    public invalidToken: boolean = false;

    private _token: string = '';
    private _pingSubscription?: Subscription;



    constructor(private _authService: AuthService, private _router: Router, private _toastService: ToastService) { }


    ngOnInit(): void {
        const cachedToken = localStorage.getItem('token');
        if (cachedToken) {
            this._router.navigate(['accounts']);
        }
    }


    ngOnDestroy(): void {
        this._pingSubscription?.unsubscribe();
    }


    public onSubmit(form: NgForm) {
        this._token = form.value.token;

        //validate token
        this._pingSubscription = this._authService.validateToken(this._token).subscribe(
            (isValid) => {
                if (isValid) {
                    localStorage.setItem('token', this._token);
                    this._router.navigate(['accounts']);
                } else {
                    this._toastService.show('Invalid token');
                    form.resetForm();
                }
            }
        );

    }


}
