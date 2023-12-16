import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  theme = 'funky';

  ngOnInit(): void {
    this.getThemeFromLocalStorage();
  }

  getThemeFromLocalStorage() {
    const themeFromStorage = localStorage.getItem('theme');
    
    if (!themeFromStorage) {
      localStorage.setItem('theme', 'funky');
      this.theme = 'funky';
    }
  
    if (themeFromStorage === 'neo') {
      this.theme = 'neo';
    } else {
      this.theme = 'funky';
    }
  }

  setThemeInLocalStorage() {
    if (this.theme === 'neo') {
      localStorage.setItem('theme', 'neo');
      this.getThemeFromLocalStorage();
    } else {
      localStorage.setItem('theme', 'funky');
      this.getThemeFromLocalStorage();
    }
  }
  
}
