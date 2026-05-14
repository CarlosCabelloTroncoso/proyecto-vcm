import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-gestor',
  imports: [CommonModule],
  templateUrl: './home-gestor.html',
  styleUrl: './home-gestor.css',
})
export class HomeGestor {

  mobileMenuOpen = false;
  profileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
}
