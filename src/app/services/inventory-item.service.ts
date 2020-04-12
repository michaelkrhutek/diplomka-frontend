import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { IInventoryItemPopulated, INewInventoryItemData } from '../models/inventory-item';
import { catchError, map, filter } from 'rxjs/operators';
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
      }),
      map((items: IInventoryItemPopulated[]) => items.sort((a, b) => a.name.localeCompare(b.name)))
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
      map((itemsStocks: IInventoryItemStock[]) => itemsStocks.map((itemStock) => new InventoryItemStock(itemStock))),
      map((itemsStocks: IInventoryItemStock[]) => itemsStocks.sort((a, b) => a.inventoryItem.name.localeCompare(b.inventoryItem.name)))
    );
  }

  getCreateInventoryItem$(financialUnitId: string, data: INewInventoryItemData): Observable<'OK'> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('name', data.name)
      .append('inventoryGroupId', data.inventoryGroupId)
    return this.http.post<any>(`${this.baseUrl}api/inventory-item/create-inventory-item`, null, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getUpdateInventoryItem$(data: INewInventoryItemData): Observable<'OK'> {
    const params: HttpParams = new HttpParams()
      .append('id', data._id)
      .append('name', data.name)
      .append('inventoryGroupId', data.inventoryGroupId)
    return this.http.post<any>(`${this.baseUrl}api/inventory-item/update-inventory-item`, null, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getDeleteInventoryItem$(id: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('id', id);
    return this.http.delete<any>(`${this.baseUrl}api/inventory-item/delete-inventory-item`, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
    );
  }

  getDeleteAllInventoryItems$(financialUnitId: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.delete<any>(`${this.baseUrl}api/inventory-item/delete-all-inventory-items`, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
    );
  }
}
