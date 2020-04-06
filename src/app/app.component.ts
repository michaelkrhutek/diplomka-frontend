import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  title = 'diplomka-frontend';

  ngOnInit(): void {
    // document.documentElement.setAttribute('color-theme', 'light');
    // document.getElementsByTagName('html')[0].setAttribute('class', 'light-theme');
    // this.router.events.subscribe((e) => console.log(e))
  }
}
