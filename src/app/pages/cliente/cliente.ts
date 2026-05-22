import { Component } from '@angular/core';
import { NavbarCliente } from '../../components/roles-contenido/cliente/navbar-cliente/navbar-cliente';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cliente',
  imports: [NavbarCliente, RouterOutlet],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente {}
