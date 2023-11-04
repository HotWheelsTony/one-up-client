import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

    public tokenForm: FormGroup;
    public invalidToken: boolean = false;
    public isToastOpen = false;


    constructor(private _formBuilder: FormBuilder, private _authService: AuthService, private _router: Router, private _toastService: ToastService) {
        this.tokenForm = this._formBuilder.group({
            token: ['', Validators.required],
        });
    }


    ngOnInit(): void {
        if (localStorage.getItem('token')) {
            this._router.navigate(['accounts']);
        }
    }


    public async onSubmit() {
        const token = this.tokenForm.value.token;
        const isTokenValid = await lastValueFrom(this._authService.validateToken(token));

        if (isTokenValid) {
            localStorage.setItem('token', token);
        } else {
            this.showToast(true);
        }
    }


    showToast(show: boolean) {
        this.isToastOpen = show;
    }


}
