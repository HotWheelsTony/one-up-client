import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './header/app-header/app-header.component';
import { AccountCardComponent } from './accounts/account-card/account-card.component';
import { ButtonComponent } from './button/button.component';
import { TransactionsComponent } from './accounts/transactions/transactions.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';


@NgModule({
    declarations: [
        AppComponent,
        AppHeaderComponent,
        AccountCardComponent,
        ButtonComponent,
        TransactionsComponent,
        AccountsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
