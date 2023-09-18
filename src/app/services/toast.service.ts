import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    private _toastSubject = new Subject<string>();

    public $toast = this._toastSubject.asObservable();


    constructor() { }

    public show(msg: string) {
        this._toastSubject.next(msg);

        setTimeout(() => {
            this.hide();
        }, 2500);

    }

    private hide() {
        this._toastSubject.next('');
    }
}
