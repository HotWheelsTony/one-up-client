import { Component } from '@angular/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent {


    constructor() { }


    // public handleSearch(event: any) {
    //     const query = event.target.value.toLowerCase();
    //     this.displayTransactions = this.transactions.filter(
    //         (e) => {
    //             return e.attributes.description.toLowerCase().includes(query);
    //         }
    //     );
    // }

}
