import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { InsightsComponent } from './pages/insights/insights.component';
import { LoginComponent } from './pages/login/login.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'accounts',
        component: AccountsComponent
    },
    {
        path: 'accounts/:accountId',
        component: TransactionsComponent
    },
    {
        path: 'accounts/:accountId/insights',
        component: InsightsComponent
    },
    {
        path: 'accounts/:accountId/search',
        component: SearchComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
