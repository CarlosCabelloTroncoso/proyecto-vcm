import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRegistro } from '../../components/content-registro/content-registro';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ContentRegistro],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {}
