import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  // Injecting ThemeService here ensures the saved theme is applied
  // to <html> as early as possible, before the rest of the app renders.
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    
  }
}
