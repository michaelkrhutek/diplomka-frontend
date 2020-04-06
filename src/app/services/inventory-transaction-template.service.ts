import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { catchError, map } from 'rxjs/operators';
import { IInventoryTransactionTemplatePopulated, IInventoryTransactionTemplate } from '../models/inventory-transaction-template';

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
      map((templates: IInventoryTransactionTemplatePopulated[]) => templates.sort((a, b) => a.inventoryGroup.name > b.inventoryGroup.name ? 1 : -1))
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
}
