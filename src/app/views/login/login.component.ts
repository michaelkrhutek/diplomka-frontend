import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  constructor(
    private authService: AuthService
  ) { }

  credentialsFG: FormGroup = new FormGroup({
    username: new FormControl(null),
    password: new FormControl(null)
  });

  login(): void {
    const data: ILoginCredentials = this.credentialsFG.value;
    this.authService.login(data);
  }
}
