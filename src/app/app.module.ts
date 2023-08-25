import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './header/app-header/app-header.component';
import { AccountCardComponent } from './accounts/account-card/account-card.component';
import { ButtonComponent } from './button/button.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AccountsComponent } from './accounts/accounts.component';
import { TransactionCardComponent } from './transactions/transaction-card/transaction-card.component';


@NgModule({
    declarations: [
        AppComponent,
        AppHeaderComponent,
        AccountCardComponent,
        ButtonComponent,
        TransactionsComponent,
        AccountsComponent,
        TransactionCardComponent
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
