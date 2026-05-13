import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ContentHome } from '../../components/content-home/content-home';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, ContentHome],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
