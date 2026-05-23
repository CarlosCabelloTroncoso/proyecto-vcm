import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css',
})
export class NavbarAdmin {
  mobileMenuOpen = false;
  profileMenuOpen = false;
}
