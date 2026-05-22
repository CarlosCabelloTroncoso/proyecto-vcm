import { Component } from '@angular/core';
import { NavbarEncargado } from '../../components/roles-contenido/encargado/navbar-encargado/navbar-encargado';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-encargado',
  imports: [NavbarEncargado, RouterOutlet],
  templateUrl: './encargado.html',
  styleUrl: './encargado.css',
})
export class Encargado {}
