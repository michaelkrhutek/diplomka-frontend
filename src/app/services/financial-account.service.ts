import { Injectable, Inject } from '@angular/core';
import { FinancialAccountType } from '../models/financial-account-type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { FinancialAccount, IFinancialAccount } from '../models/financial-account';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinancialAccountService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getFinancialAccounts$(financialUnitId: string): Observable<FinancialAccount[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IFinancialAccount[]>(`${this.baseUrl}api/financial-account/get-all-financial-accounts`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((accounts: IFinancialAccount[]) => accounts.map(account => new FinancialAccount(account)))
    );
  }

  getAllFinancialAccountTypes(): FinancialAccountType[] {
    return [
      FinancialAccountType.Assets,
      FinancialAccountType.Liabilities,
      FinancialAccountType.Equity,
      FinancialAccountType.Revenues,
      FinancialAccountType.Expenses
    ];
  }

  getFinancialAccountTypeName(type: FinancialAccountType): string {
    switch (type) {
      case FinancialAccountType.Assets:
        return 'Assets';
      case FinancialAccountType.Equity:
        return 'Equity';
      case FinancialAccountType.Liabilities:
        return 'Liabilities';
      case FinancialAccountType.Revenues:
        return 'Revenues';
      case FinancialAccountType.Expenses:
        return 'Expenses';
      default:
        return 'N/A';
    }
  }
}
