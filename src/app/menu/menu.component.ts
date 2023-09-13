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
        this.isOpen = !this.isOpen;
    }

    @HostListener('document:click', ['$event'])
    public onDocumentClick(event: MouseEvent) {
        if (this.isOpen && !(event.target as HTMLElement).closest('.overlay-menu')) {
            this.isOpen = false;
        }
    }


}


