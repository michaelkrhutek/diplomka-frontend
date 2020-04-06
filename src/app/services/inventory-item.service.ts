import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { IInventoryItemPopulated } from '../models/inventory-item';
import { catchError, map } from 'rxjs/operators';
import { IInventoryItemStock, InventoryItemStock } from '../models/inventory-item-stock';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getInventoryItems$(financialUnitId: string): Observable<IInventoryItemPopulated[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryItemPopulated[]>(`${this.baseUrl}api/inventory-item/get-all-inventory-items`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }

  getInventoryItemsWithStock$(financialUnitId: string, effectiveDate: Date): Observable<InventoryItemStock[]> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('effectiveDate', effectiveDate.toDateString());
    return this.http.get<IInventoryItemStock[]>(`${this.baseUrl}api/inventory-item/get-inventory-items-with-stock`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((itemsStocks: IInventoryItemStock[]) => itemsStocks.map((itemStock) => new InventoryItemStock(itemStock)))
    );
  }
}
