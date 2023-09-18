import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit, OnDestroy {
    @Input()
    public message: string = '';
    public visible: boolean = false;

    private _toastSubscription?: Subscription;


    constructor(private _toastService: ToastService) { }

    ngOnInit(): void {
        this._toastSubscription = this._toastService.$toast.subscribe(
            (msg) => {
                if (msg) {
                    this.visible = true;
                    this.message = msg;
                } else {
                    this.visible = false;
                }
            }
        );
    }

    ngOnDestroy(): void {
        this._toastSubscription?.unsubscribe();
    }

}
