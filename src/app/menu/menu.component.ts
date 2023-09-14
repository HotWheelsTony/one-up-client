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
    }[] = [];


    public toggle() {
        this.isOpen = !this.isOpen;
    }

    @HostListener('document:click', ['$event'])
    public onDocumentClick(event: MouseEvent) {
        // Close the menu if anywhere else on the screen is clicked/tapped
        if (!(event.target as HTMLElement).matches('.menu-trigger')) {
            this.isOpen = false;
        }
    }



}


