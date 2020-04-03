import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PopUpsService } from '../services/pop-ups.service';

@Injectable({
    providedIn: 'root'
})
export class IsUserLoggedInGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router,
        private popUpsService: PopUpsService
    ) { }

    canActivate(): Observable<boolean> {
        const isUserLoggedIn$: Observable<boolean> = this.auth.user$.pipe(
            map(user => !!user),
            tap((isLoggedIn: boolean) => {
                !isLoggedIn && this.router.navigate(['login']).finally(() => this.popUpsService.closeLoadingModal())
            })
        )
        return isUserLoggedIn$;
    }
}