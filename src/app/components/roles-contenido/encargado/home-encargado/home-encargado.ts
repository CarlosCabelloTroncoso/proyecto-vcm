import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-encargado',
  imports: [CommonModule],
  templateUrl: './home-encargado.html',
  styleUrl: './home-encargado.css',
})
export class HomeEncargado {

  mobileMenuOpen = false;
  profileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
}
