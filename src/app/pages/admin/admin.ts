import { Component } from '@angular/core';
import { NavbarAdmin } from '../../components/roles-contenido/admin/navbar-admin/navbar-admin';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [ NavbarAdmin, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {}
