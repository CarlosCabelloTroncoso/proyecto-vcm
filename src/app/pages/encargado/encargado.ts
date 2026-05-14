import { Component } from '@angular/core';
import { HomeEncargado } from '../../components/roles-contenido/encargado/home-encargado/home-encargado';

@Component({
  selector: 'app-encargado',
  imports: [HomeEncargado],
  templateUrl: './encargado.html',
  styleUrl: './encargado.css',
})
export class Encargado {}
