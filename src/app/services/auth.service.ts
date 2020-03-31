import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { ISignUpCredentials } from '../models/sign-up-credentials';
import { catchError, filter, finalize, tap } from 'rxjs/operators';
import { of, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) {
    this.getUserFromCookie();
  }

  private userSource: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  user$: Observable<IUser> = this.userSource.asObservable().pipe(
    tap(v => console.log(v))
  );

  getUserFromCookie(): void {
    this.http.get(`${this.baseUrl}auth`).pipe(
      catchError(() => of(null))
    ).subscribe((user) => this.userSource.next(user))
  }

  login(loginCredentials: ILoginCredentials): void {
    this.popUpsService.openLoadingModal({ message: 'Prihlasuji' });
    const headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');
    this.http.post<any>(
      `${this.baseUrl}auth/login`, JSON.stringify(loginCredentials),
      { headers }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe((user: IUser) => {
      console.log(user);
      this.userSource.next(user);
    });
  }

  signUp(signUpCredentials: ISignUpCredentials): void {
    this.popUpsService.openLoadingModal({ message: 'Vytvářím ucet' });
    const headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');
    this.http.post<any>(
      `${this.baseUrl}auth/sign-up`, JSON.stringify(signUpCredentials),
      { headers }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe((user: IUser) => {
      console.log(user);
      this.userSource.next(user);
    });
  }
}
