import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { FinancialPeriod, IFinancialPeriod } from '../models/financial-period';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinancialPeriodService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService,
  ) { }

  getFinancialPeriods$(financialUnitId: string): Observable<FinancialPeriod[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IFinancialPeriod[]>(`${this.baseUrl}api/financial-period/get-all-financial-periods`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((financialPeriods: IFinancialPeriod[]) => {
        const unsortedFinancialPeriods: IFinancialPeriod[] = financialPeriods.map(financialPeriod => new FinancialPeriod(financialPeriod));
        return unsortedFinancialPeriods.sort((a, b) => a.startDate.getMilliseconds() - b.startDate.getMilliseconds());
      })
    );
  }
}
