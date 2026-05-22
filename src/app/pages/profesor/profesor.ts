import { Component } from '@angular/core';
import { NavbarProfesor } from '../../components/roles-contenido/profesor/navbar-profesor/navbar-profesor';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profesor',
  imports: [NavbarProfesor, RouterOutlet],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css',
})
export class Profesor {}
