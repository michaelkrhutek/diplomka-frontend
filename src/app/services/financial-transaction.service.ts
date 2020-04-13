import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { FinancialTransactionPopulated, IFinancialTransactionPopulated } from '../models/financial-transaction';
import { map, catchError } from 'rxjs/operators';
import { IFinancialTransactionsFilteringCriteria } from '../models/financial-transactions-filtering-criteria';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactionService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getFinancialTransactions$(financialUnitId: string): Observable<FinancialTransactionPopulated[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IFinancialTransactionPopulated[]>(`${this.baseUrl}api/financial-transaction/get-all-financial-transactions`, { params }).pipe(
      map((transactions) => transactions.map((transaction) => new FinancialTransactionPopulated(transaction))),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }

  getFiltredFinancialTransactions$(
    financialUnitId: string,
    filteringCriteria: IFinancialTransactionsFilteringCriteria
  ): Observable<FinancialTransactionPopulated[]> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('accountId', filteringCriteria.accountId || '')
      .append('dateFrom', filteringCriteria.dateFrom ? filteringCriteria.dateFrom.toDateString() : '')
      .append('dateTo', filteringCriteria.dateTo ? filteringCriteria.dateTo.toDateString() : '');
    return this.http.get<IFinancialTransactionPopulated[]>(`${this.baseUrl}api/financial-transaction/get-filtred-financial-transactions`, { params }).pipe(
      map((transactions) => transactions.map((transaction) => new FinancialTransactionPopulated(transaction))),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }

  getFiltredFinancialTransactionsCount$(
    financialUnitId: string,
    filteringCriteria: IFinancialTransactionsFilteringCriteria
  ): Observable<number> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('accountId', filteringCriteria.accountId || '')
      .append('dateFrom', filteringCriteria.dateFrom ? filteringCriteria.dateFrom.toDateString() : '')
      .append('dateTo', filteringCriteria.dateTo ? filteringCriteria.dateTo.toDateString() : '');
    return this.http.get<number>(`${this.baseUrl}api/financial-transaction/get-filtred-financial-transactions-count`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(0);
      })
    );
  }

  getFiltredPaginatedFinancialTransactions$(
    financialUnitId: string,
    filteringCriteria: IFinancialTransactionsFilteringCriteria,
    pageIndex: number,
    pageSize: number
  ): Observable<FinancialTransactionPopulated[]> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('accountId', filteringCriteria.accountId || '')
      .append('dateFrom', filteringCriteria.dateFrom ? filteringCriteria.dateFrom.toDateString() : '')
      .append('dateTo', filteringCriteria.dateTo ? filteringCriteria.dateTo.toDateString() : '')
      .append('pageIndex', pageIndex.toString())
      .append('pageSize', pageSize.toString())
    return this.http.get<IFinancialTransactionPopulated[]>(`${this.baseUrl}api/financial-transaction/get-filtred-paginated-financial-transactions`, { params }).pipe(
      map((transactions) => transactions.map((transaction) => new FinancialTransactionPopulated(transaction))),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }
}
