import { Component, HostListener, Input } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {
    public isOpen: boolean = false;

    @Input()
    public menuItems: {
        name: string;
        function: Function;
    }[] = [{
        name: 'Search',
        function: () => console.log('Search clicked!'),
    },
    {
        name: 'Insights',
        function: () => console.log('Insights clicked!')
    },
        ];


    public toggle() {
        console.log('toggling')
        this.isOpen = !this.isOpen;
    }



}

