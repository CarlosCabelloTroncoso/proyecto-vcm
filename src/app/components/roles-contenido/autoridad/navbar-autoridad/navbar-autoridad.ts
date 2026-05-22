import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-autoridad',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-autoridad.html',
  styleUrl: './navbar-autoridad.css',
})
export class NavbarAutoridad {
  mobileMenuOpen = false;
  profileMenuOpen = false;
}
