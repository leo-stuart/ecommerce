import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationHeaderComponent } from './organisms/navigation-header/navigation-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('E-commerce CRUD');
}
