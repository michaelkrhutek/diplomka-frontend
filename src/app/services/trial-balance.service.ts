import { Injectable, Inject } from '@angular/core';
import { TrialBalance, ITrialBalance } from '../models/trial-balance';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrialBalanceService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getFinancialPeriodTrialBalance$(financialPeriodId: string): Observable<TrialBalance> {
    const params: HttpParams = new HttpParams().append('financialPeriodId', financialPeriodId);
    return this.http.get<ITrialBalance>(`${this.baseUrl}api/financial-transaction/get-financial-period-trial-balance`, { params }).pipe(
      map((trialBalance) => new TrialBalance(trialBalance)),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      })
    );
  }
}
