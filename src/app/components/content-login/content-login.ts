import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-content-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './content-login.html',
  styleUrl: './content-login.css',
})
export class ContentLogin {}
