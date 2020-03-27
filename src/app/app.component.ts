import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(
    private router: Router
  ) {}

  title = 'diplomka-frontend';

  ngOnInit(): void {
    document.documentElement.setAttribute('color-theme', 'dark');
    document.getElementsByTagName('html')[0].setAttribute('class', 'dark-theme');
    // this.router.events.subscribe((e) => console.log(e))
  }
}
