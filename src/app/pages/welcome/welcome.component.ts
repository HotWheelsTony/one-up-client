import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

    public tokenForm: FormGroup;
    public invalidToken: boolean = false;
    public isToastOpen = false;


    constructor(private _loadingCtrl: LoadingController, private _formBuilder: FormBuilder, private _authService: AuthService, private _router: Router) {
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
        this.showLoading(true);

        const token = this.tokenForm.value.token;
        const isTokenValid = await lastValueFrom(this._authService.validateToken(token));

        this.showLoading(false);

        if (isTokenValid) {
            localStorage.setItem('token', token);
            this._router.navigate(['accounts']);
        } else {
            this.showToast(true);
        }
    }


    private async showLoading(show: boolean) {
        if (show) {
            const loading = await this._loadingCtrl.create({
                message: 'Verifying token...',
                spinner: 'crescent',
            });
            loading.present();
        } else {
            this._loadingCtrl.dismiss();
        }
    }


    showToast(show: boolean) {
        this.isToastOpen = show;
    }


}
