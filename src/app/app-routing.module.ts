import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AccountsComponent } from './accounts/accounts.component';

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
        path: ':accountId',
        component: TransactionsComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
