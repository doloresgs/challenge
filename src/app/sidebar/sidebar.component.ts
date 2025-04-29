import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  visible = false;

  items = [
    { routeLink: '/dashboard', icon: 'pi pi-home', label: 'Dashboard' },
    { routeLink: '/category-tree', icon: 'pi pi-sitemap', label: 'Categories and Subcategories' },
    { routeLink: '/data-graphics', icon: 'pi pi-chart-bar', label: 'Data Graphics' }
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeSidebar();
      }
    });
  }

  toggleSidebar(): void {
    this.visible = !this.visible;
  }

  closeSidebar(): void {
    this.visible = false;
  }  
}