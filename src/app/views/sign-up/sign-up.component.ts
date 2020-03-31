import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ISignUpCredentials } from 'src/app/models/sign-up-credentials';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {

  constructor(
    private authService: AuthService
  ) { }

  credentialsFG: FormGroup = new FormGroup({
    displayName: new FormControl(null),
    username: new FormControl(null),
    password: new FormControl(null)
  });

  signUp(): void {
    const data: ISignUpCredentials = this.credentialsFG.value;
    this.authService.signUp(data);
  }
}
