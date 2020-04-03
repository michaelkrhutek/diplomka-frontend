import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  credentialsFG: FormGroup = new FormGroup({
    username: new FormControl(null),
    password: new FormControl(null)
  });

  ngOnInit(): void {
    this.authService.user$.pipe(
      filter(user => !!user),
      take(1)
    ).subscribe(() => this.router.navigate(['']));
  }

  login(): void {
    const data: ILoginCredentials = this.credentialsFG.value;
    this.authService.login(data);
  }
}
