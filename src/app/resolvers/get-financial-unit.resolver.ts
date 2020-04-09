import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FinancialUnitService } from '../services/financial-unit.service';
import { tap } from 'rxjs/operators';
import { PopUpsService } from '../services/pop-ups.service';
import { IFinancialUnit } from '../models/financial-unit';

@Injectable({
    providedIn: 'root'
})
export class GetFinancialUnitResolver implements Resolve<IFinancialUnit> {

    constructor(
        private financialUnitService: FinancialUnitService,
        private router: Router,
        private popUpsService: PopUpsService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IFinancialUnit> {
        const financialUnitId: string = route.paramMap.get('financialUnitId')
        return this.financialUnitService.getFinancialUnit$(financialUnitId).pipe(
            tap((financialUnit: IFinancialUnit) => {
                !financialUnit && this.router.navigate(['/']).finally(() => this.popUpsService.closeLoadingModal());
            })
        );
    }
}