import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TransactionsComponent } from './accounts/transactions/transactions.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';

const routes: Routes = [
    {
        path: '',
        component: AccountsComponent,
    },
    {
        path: 'accounts',
        component: AccountsComponent,
    },
    {
        path: ':accountId/transactions',
        component: TransactionsComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
