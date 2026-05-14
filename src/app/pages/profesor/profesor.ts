import { Component } from '@angular/core';
import { HomeProfesor } from '../../components/roles-contenido/profesor/home-profesor/home-profesor';

@Component({
  selector: 'app-profesor',
  imports: [HomeProfesor],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css',
})
export class Profesor {}
