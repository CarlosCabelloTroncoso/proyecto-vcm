import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLogin } from '../../components/content-login/content-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ContentLogin],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
