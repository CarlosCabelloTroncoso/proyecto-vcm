import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-content-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './content-home.html',
  styleUrl: './content-home.css',
})
export class ContentHome {}
