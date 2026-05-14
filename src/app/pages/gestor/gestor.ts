import { Component } from '@angular/core';
import { HomeGestor } from '../../components/roles-contenido/gestor/home-gestor/home-gestor';

@Component({
  selector: 'app-gestor',
  imports: [HomeGestor],
  templateUrl: './gestor.html',
  styleUrl: './gestor.css',
})
export class Gestor {}
