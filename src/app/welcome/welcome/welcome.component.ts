import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {


    private _token: string = '';
    private _pingSubscription?: Subscription;



    constructor(private _authService: AuthService) { }


    ngOnInit(): void {
        const cachedToken = localStorage.getItem('token');

        if (cachedToken) {
            //redirect
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
                    console.log('valid token');
                    localStorage.setItem('token', this._token);
                    //redirect


                } else {
                    //error toast
                    //reset form
                    form.resetForm();
                }
            }
        );

    }


}
