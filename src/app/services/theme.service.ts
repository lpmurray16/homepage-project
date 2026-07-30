import { Injectable } from '@angular/core';

export type ThemeName = 'default' | 'synthwave' | 'neobrutalism';

const STORAGE_KEY = 'logan-linkz-theme';
const THEMES: ThemeName[] = ['default', 'synthwave', 'neobrutalism'];
const THEME_LABELS: Record<ThemeName, string> = {
  default: 'Classic',
  synthwave: 'Synthwave',
  neobrutalism: 'Neo Brutalism',
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private current: ThemeName = 'default';

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    this.current = saved && THEMES.includes(saved) ? saved : 'default';
    this.applyTheme(this.current);
  }

  get currentTheme(): ThemeName {
    return this.current;
  }

  get nextThemeLabel(): string {
    const currentIndex = THEMES.indexOf(this.current);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    return THEME_LABELS[nextTheme];
  }

  setTheme(theme: ThemeName): void {
    this.current = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentIndex = THEMES.indexOf(this.current);
    this.setTheme(THEMES[(currentIndex + 1) % THEMES.length]);
  }

  private applyTheme(theme: ThemeName): void {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
