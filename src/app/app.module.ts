import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InsightsComponent } from './pages/insights/insights.component';
import { BarChartComponent } from './insights/bar-chart/bar-chart.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchComponent } from './pages/search/search.component';
import { DateTime, Duration } from 'luxon';
import { TransactionsListComponent } from './components/transactions-list/transactions-list.component';




@NgModule({
    declarations: [
        AppComponent,
        TransactionsComponent,
        AccountsComponent,
        MenuComponent,
        InsightsComponent,
        BarChartComponent,
        LoginComponent,
        SearchComponent,
        TransactionsListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
    ],
    providers: [
        { provide: 'DateTime', useValue: DateTime },
        { provide: 'Duration', useValue: Duration },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
