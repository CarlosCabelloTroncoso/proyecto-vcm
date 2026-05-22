import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-cliente',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-cliente.html',
  styleUrl: './navbar-cliente.css',
})
export class NavbarCliente {
  mobileMenuOpen = false;
  profileMenuOpen = false;
}
