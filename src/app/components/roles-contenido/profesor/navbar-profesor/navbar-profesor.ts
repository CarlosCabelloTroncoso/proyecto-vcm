import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-profesor',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-profesor.html',
  styleUrl: './navbar-profesor.css',
})
export class NavbarProfesor {
  mobileMenuOpen = false;
  profileMenuOpen = false;
}
