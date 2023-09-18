import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AccountsComponent } from './accounts/accounts.component';
import { InsightsComponent } from './insights/insights/insights.component';
import { WelcomeComponent } from './welcome/welcome/welcome.component';

const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
    },
    {
        path: 'accounts',
        component: AccountsComponent,
    },
    {
        path: 'accounts/:accountId',
        component: TransactionsComponent
    },
    {
        path: 'accounts/:accountId/insights',
        component: InsightsComponent
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
