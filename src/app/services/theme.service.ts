import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeMode } from '../models/theme-mode';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() {
    window.matchMedia("(prefers-color-scheme: light)").matches ? this.setThemeMode(ThemeMode.Light) : this.setThemeMode(ThemeMode.Dark);
  }

  private activeThemeModeSource: BehaviorSubject<ThemeMode> = new BehaviorSubject<ThemeMode>(null);
  activeThemeMode$: Observable<ThemeMode> = this.activeThemeModeSource.asObservable();

  setThemeMode(themeMode: ThemeMode): void {
    switch (themeMode) {
      case ThemeMode.Light:
        document.documentElement.setAttribute('color-theme', 'light');
        document.getElementsByTagName('html')[0].setAttribute('class', 'light-theme');
        this.activeThemeModeSource.next(ThemeMode.Light);
        break;
      case ThemeMode.Dark:
        document.documentElement.setAttribute('color-theme', 'dark');
        document.getElementsByTagName('html')[0].setAttribute('class', 'dark-theme');
        this.activeThemeModeSource.next(ThemeMode.Dark);
        break;
    }
  }

  toogleThemeMode(): void {
    const currentThemeMode: ThemeMode = this.activeThemeModeSource.getValue();
    console.log(currentThemeMode);
    this.setThemeMode(currentThemeMode == ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light);
  }
}
