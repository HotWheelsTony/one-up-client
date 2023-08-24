import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home.component';
import { AppHeaderComponent } from './header/app-header/app-header.component';
import { AccountCardComponent } from './accounts/account-card/account-card.component';
import { ButtonComponent } from './button/button.component';
import { TransactionsComponent } from './accounts/transactions/transactions.component';

@NgModule({
    declarations: [
        HomeComponent,
        AppHeaderComponent,
        AccountCardComponent,
        ButtonComponent,
        TransactionsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [HomeComponent]
})
export class AppModule { }
