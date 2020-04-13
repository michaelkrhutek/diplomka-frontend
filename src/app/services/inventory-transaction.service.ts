import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';
import { IInventoryTransactionPopulated, InventoryTransactionPopulated, INewInventoryTransactionRequestData } from '../models/inventory-transaction';
import { InventoryTransactionType } from '../models/inventory-transaction-type';
import { IInventoryTransactionFilteringCriteria } from '../models/inventory-transaction-filtering-criteria';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getInventoryTransactions$(financialUnitId: string): Observable<InventoryTransactionPopulated<any>[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryTransactionPopulated<any>[]>(
      `${this.baseUrl}api/inventory-transaction/get-inventory-transactions`,
      { params }
    ).pipe(
      map((transactions) => transactions.map((transaction) => new InventoryTransactionPopulated<any>(transaction))),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }

  getFiltredInventoryTransactions$(
    financialUnitId: string,
    filteringCriteria: IInventoryTransactionFilteringCriteria
  ): Observable<InventoryTransactionPopulated<any>[]> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('inventoryItemId', filteringCriteria.inventoryItemId || '')
      .append('transactionType', filteringCriteria.transactionType || '')
      .append('dateFrom', filteringCriteria.dateFrom ? filteringCriteria.dateFrom.toDateString() : '')
      .append('dateTo', filteringCriteria.dateTo ? filteringCriteria.dateTo.toDateString() : '');
    return this.http.get<IInventoryTransactionPopulated<any>[]>(
      `${this.baseUrl}api/inventory-transaction/get-filtred-inventory-transactions`,
      { params }
    ).pipe(
      map((transactions) => transactions.map((transaction) => new InventoryTransactionPopulated<any>(transaction))),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }

  getFiltredInventoryTransactionsTotalCount$(
    financialUnitId: string,
    filteringCriteria: IInventoryTransactionFilteringCriteria
  ): Observable<number> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('inventoryItemId', filteringCriteria.inventoryItemId || '')
      .append('transactionType', filteringCriteria.transactionType || '')
      .append('dateFrom', filteringCriteria.dateFrom ? filteringCriteria.dateFrom.toDateString() : '')
      .append('dateTo', filteringCriteria.dateTo ? filteringCriteria.dateTo.toDateString() : '');
    return this.http.get<number>(
      `${this.baseUrl}api/inventory-transaction/get-filtred-inventory-transactions-count`,
      { params }
    ).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(0);
      })
    );
  }

  getFiltredPaginatedInventoryTransactions$(
    financialUnitId: string,
    filteringCriteria: IInventoryTransactionFilteringCriteria,
    pageIndex: number,
    pageSize: number
  ): Observable<InventoryTransactionPopulated<any>[]> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('inventoryItemId', filteringCriteria.inventoryItemId || '')
      .append('transactionType', filteringCriteria.transactionType || '')
      .append('dateFrom', filteringCriteria.dateFrom ? filteringCriteria.dateFrom.toDateString() : '')
      .append('dateTo', filteringCriteria.dateTo ? filteringCriteria.dateTo.toDateString() : '')
      .append('pageIndex', pageIndex.toString())
      .append('pageSize', pageSize.toString());
    return this.http.get<IInventoryTransactionPopulated<any>[]>(
      `${this.baseUrl}api/inventory-transaction/get-filtred-paginated-inventory-transactions`,
      { params }
    ).pipe(
      map((transactions) => transactions.map((transaction) => new InventoryTransactionPopulated<any>(transaction))),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }

  getCreateInventoryTransaction$(
    transactionType: InventoryTransactionType,
    requestData: INewInventoryTransactionRequestData<any>
  ): Observable<'OK'> {
    this.popUpsService.openLoadingModal({ message: 'Vytvářím transakci' });
    const headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');
    const params: HttpParams = new HttpParams().append('type', transactionType);
    return this.http.post<any>(
      `${this.baseUrl}api/inventory-transaction/create-inventory-transaction`, JSON.stringify(requestData),
      { headers, params }
    ).pipe(
      map(() => 'OK'),
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getDeleteInventoryTransaction$(id: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('id', id);
    return this.http.delete<any>(`${this.baseUrl}api/inventory-transaction/delete-inventory-transaction`, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getDeleteAllTransactions$(financialUnitId: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.delete<any>(`${this.baseUrl}api/financial-unit/delete-all-transactions`, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getAllInventoryTransactionTypes(): InventoryTransactionType[] {
    return [
      InventoryTransactionType.Increment,
      InventoryTransactionType.Decrement,
      InventoryTransactionType.Sale
    ];
  };

  getTransactionTypeDescription(type: InventoryTransactionType): string {
    switch (type) {
        case InventoryTransactionType.Increment:
            return 'Přírůstek';
        case InventoryTransactionType.Decrement:
            return 'Úbytek';
        case InventoryTransactionType.Sale:
          return 'Prodej';
        default:
            return 'N/A';
    }
  }
}
