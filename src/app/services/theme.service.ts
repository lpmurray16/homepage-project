import { Injectable } from '@angular/core';

export type ThemeName = 'default' | 'aurora';

const STORAGE_KEY = 'logan-linkz-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private current: ThemeName = 'default';

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    this.current = saved === 'aurora' ? 'aurora' : 'default';
    this.applyTheme(this.current);
  }

  get currentTheme(): ThemeName {
    return this.current;
  }

  setTheme(theme: ThemeName): void {
    this.current = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    this.setTheme(this.current === 'default' ? 'aurora' : 'default');
  }

  private applyTheme(theme: ThemeName): void {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
