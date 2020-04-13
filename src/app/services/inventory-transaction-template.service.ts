import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { catchError, map, filter } from 'rxjs/operators';
import { IInventoryTransactionTemplatePopulated, INewInventoryTransactionTemplateRequestData } from '../models/inventory-transaction-template';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionTemplateService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getAllInventoryTransactionTemplates$(financialUnitId: string): Observable<IInventoryTransactionTemplatePopulated[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryTransactionTemplatePopulated[]>(
      `${this.baseUrl}api/inventory-transaction-template/get-all-inventory-transaction-templates`, { params }
    ).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((templates: IInventoryTransactionTemplatePopulated[]) => templates.sort((a, b) => a.inventoryGroup.name.localeCompare(b.inventoryGroup.name)))
    );
  }

  getInventoryGroupTransactionTemplates$(inventoryGroupId: string): Observable<IInventoryTransactionTemplatePopulated[]> {
    const params: HttpParams = new HttpParams().append('inventoryGroupId', inventoryGroupId);
    return this.http.get<IInventoryTransactionTemplatePopulated[]>(
      `${this.baseUrl}api/inventory-transaction-template/get-inventory-transaction-templates`, { params }
    ).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      })
    );
  }

  getCreateTransactionTemplate$(
    financialUnitId: string,
    requestData: INewInventoryTransactionTemplateRequestData
  ): Observable<'OK'> {
    const headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId)
    return this.http.post<any>(
      `${this.baseUrl}api/inventory-transaction-template/create-inventory-transaction-template`, JSON.stringify(requestData),
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

  getDeleteTransactionTemplate$(id: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('id', id);
    return this.http.delete<any>(`${this.baseUrl}api/inventory-transaction-template/delete-inventory-transaction-template`, { params }).pipe(
      map(() => 'OK'),
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getDeleteAllTransactionTemplates$(financialUnitId: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.delete<any>(`${this.baseUrl}api/inventory-transaction-template/delete-all-inventory-transaction-templates`, { params }).pipe(
      map(() => 'OK'),
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }
}
