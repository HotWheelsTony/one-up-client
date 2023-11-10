import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    public searchForm: FormGroup;

    private _searchFormSubscription?: Subscription;

    constructor(private _formBuilder: FormBuilder) {
        this.searchForm = this._formBuilder.group({
            query: [],
            since: [],
            until: [],
            fromAmount: [],
            toAmount: [],
        });
    }


    ngOnInit(): void {
        this._searchFormSubscription = this.searchForm.valueChanges.subscribe(
            () => {
                //use values from form to call update and filter methods here
                console.log(this.searchForm.value);

            }
        );
    }


    ngOnDestroy(): void {
        this._searchFormSubscription?.unsubscribe();
    }



    // public handleSearch(event: any) {
    //     const query = event.target.value.toLowerCase();
    //     this.displayTransactions = this.transactions.filter(
    //         (e) => {
    //             return e.attributes.description.toLowerCase().includes(query);
    //         }
    //     );
    // }

}
