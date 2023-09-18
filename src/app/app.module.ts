import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './header/header.component';
import { AccountCardComponent } from './accounts/account-card/account-card.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AccountsComponent } from './accounts/accounts.component';
import { TransactionCardComponent } from './transactions/transaction-card/transaction-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InsightsComponent } from './insights/insights/insights.component';
import { BarChartComponent } from './insights/bar-chart/bar-chart.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from './toast/toast.component';




@NgModule({
    declarations: [
        AppComponent,
        AppHeaderComponent,
        AccountCardComponent,
        TransactionsComponent,
        AccountsComponent,
        TransactionCardComponent,
        MenuComponent,
        InsightsComponent,
        BarChartComponent,
        WelcomeComponent,
        ToastComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MatIconModule,
        BrowserAnimationsModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
