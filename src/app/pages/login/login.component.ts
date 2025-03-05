import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    public tokenForm: FormGroup;
    public invalidToken: boolean = false;
    public isToastOpen = false;


    constructor(private _loadingCtrl: LoadingController,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _router: Router) {
        this.tokenForm = this._formBuilder.group({
            token: ['', Validators.required],
        });
    }


    public async onSubmit() {
        await this.showLoading(true);

        const token = this.tokenForm.value.token;
        const validated = await lastValueFrom(this._authService.validateToken(token));

        await this.showLoading(false);

        if (validated) {
            localStorage.setItem('token', token);
            this._router.navigate(['/']);
        } else {
            this.showToast(true);
        }
    }


    private async showLoading(show: boolean) {
        if (show) {
            const loading = await this._loadingCtrl.create({
                message: 'Validating token...',
                spinner: 'crescent',
            });
            loading.present();
        } else {
            this._loadingCtrl.dismiss();
        }
    }


    public showToast(show: boolean) {
        this.isToastOpen = show;
    }


}
