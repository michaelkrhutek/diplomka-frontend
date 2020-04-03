import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ISignUpCredentials } from 'src/app/models/sign-up-credentials';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  credentialsFG: FormGroup = new FormGroup({
    displayName: new FormControl(null),
    username: new FormControl(null),
    password: new FormControl(null)
  });

  ngOnInit(): void {
    this.authService.user$.pipe(
      filter(user => !!user),
      take(1)
    ).subscribe(() => this.router.navigate(['']));
  }

  signUp(): void {
    const data: ISignUpCredentials = this.credentialsFG.value;
    this.authService.signUp(data);
  }
}
