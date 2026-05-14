import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-profesor',
  imports: [CommonModule],
  templateUrl: './home-profesor.html',
  styleUrl: './home-profesor.css',
})
export class HomeProfesor {
    mobileMenuOpen = false;
  profileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
}
