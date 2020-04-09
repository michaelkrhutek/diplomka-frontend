import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IInventoryTransactionPopulated, InventoryTransactionPopulated } from '../models/inventory-transaction';
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
      `${this.baseUrl}api/inventory-transaction/get-filtred-inventory-transactions-total-count`,
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
      .append('pageIndex', pageSize.toString())
      .append('pageSize', pageIndex.toString());
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

  getAllInventoryTransactionTypes(): InventoryTransactionType[] {
    return [
      InventoryTransactionType.Increment,
      InventoryTransactionType.Decrement
    ];
  };

  getTransactionTypeDescription(type: InventoryTransactionType): string {
    switch (type) {
        case InventoryTransactionType.Increment:
            return 'Přírůstek';
        case InventoryTransactionType.Decrement:
            return 'Úbytek';
        default:
            return 'N/A';
    }
  }
}
