import { Component } from '@angular/core';
import { NavbarAutoridad } from '../../components/roles-contenido/autoridad/navbar-autoridad/navbar-autoridad';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-autoridad',
  imports: [NavbarAutoridad, RouterOutlet],
  templateUrl: './autoridad.html',
  styleUrl: './autoridad.css',
})
export class Autoridad {}
