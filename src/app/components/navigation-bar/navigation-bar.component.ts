import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.authService.user$.subscribe();
  }

  user$: Observable<IUser> = this.authService.user$;

  toogleThemeMode(): void {
    this.themeService.toogleThemeMode();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login'])
  }
}
