import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  mobileMenuOpen = false;

    toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
