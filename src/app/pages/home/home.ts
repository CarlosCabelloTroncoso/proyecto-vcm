import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHome } from '../../components/content-home/content-home';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContentHome],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
