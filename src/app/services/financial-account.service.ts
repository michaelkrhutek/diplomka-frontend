import { Injectable, Inject } from '@angular/core';
import { FinancialAccountType } from '../models/financial-account-type';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { FinancialAccount, IFinancialAccount, INewFinancialAccountData } from '../models/financial-account';
import { catchError, map, tap, filter } from 'rxjs/operators';

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
      map((accounts: IFinancialAccount[]) => accounts.map(account => new FinancialAccount(account))),
      map((accounts: FinancialAccount[]) => accounts.sort((a, b) => a.code > b.code ? 1 : -1)),
    );
  }

  getCreateFinancialAccount$(financialUnitId: string, data: INewFinancialAccountData): Observable<any> {
    const params: HttpParams = new HttpParams()
      .append('name', data.name)
      .append('code', data.code)
      .append('financialUnitId', financialUnitId)
    return this.http.post<any>(`${this.baseUrl}api/financial-account/create-financial-account`, null, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getUpdateFinancialAccount$(data: INewFinancialAccountData): Observable<'OK'> {
    const params: HttpParams = new HttpParams()
      .append('id', data._id)
      .append('name', data.name)
      .append('code', data.code)
    return this.http.post<any>(`${this.baseUrl}api/financial-account/update-financial-account`, null, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getDeleteFinancialAccount$(id: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('id', id);
    return this.http.delete<any>(`${this.baseUrl}api/financial-account/delete-financial-account`, { params }).pipe(
      map(() => 'OK'),
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getDeleteAllFinancialAccounts$(financialUnitId: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.delete<any>(`${this.baseUrl}api/financial-account/delete-all-financial-accounts`, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getAllInventoryTransactionTypes(): FinancialAccountType[] {
    return [
      FinancialAccountType.Assets,
      FinancialAccountType.Liabilities,
      FinancialAccountType.Expenses,
      FinancialAccountType.Revenues
    ];
  }

  getFinancialAccountTypeDescription(type: FinancialAccountType): string {
    switch (type) {
      case FinancialAccountType.Assets:
        return 'Majetek';
      case FinancialAccountType.Liabilities:
        return 'Závazky';
      case FinancialAccountType.Expenses:
        return 'Náklady';
      case FinancialAccountType.Revenues:
        return 'Výnosy';
      default:
        return 'N/A';
    }
  }
}
