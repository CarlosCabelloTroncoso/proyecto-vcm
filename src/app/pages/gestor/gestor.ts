import { Component } from '@angular/core';
import { NavbarGestor } from '../../components/roles-contenido/gestor/navbar-gestor/navbar-gestor';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gestor',
  imports: [NavbarGestor, RouterOutlet],
  templateUrl: './gestor.html',
  styleUrl: './gestor.css',
})
export class Gestor {}
