import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { InsightsComponent } from './pages/insights/insights.component';
import { LoginComponent } from './pages/login/login.component';
import { SearchComponent } from './pages/search/search.component';
import { TransactionDetailsComponent } from './pages/transaction-details/transaction-details.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        component: AccountsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ':accountId',
        component: TransactionsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ':accountId/insights',
        component: InsightsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ':accountId/search',
        component: SearchComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ':accountId/:transactionId',
        component: TransactionDetailsComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
