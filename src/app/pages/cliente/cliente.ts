import { Component } from '@angular/core';
import { HomeCliente } from '../../components/roles-contenido/cliente/home-cliente/home-cliente';

@Component({
  selector: 'app-cliente',
  imports: [HomeCliente],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente {}
