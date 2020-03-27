import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { catchError } from 'rxjs/operators';
import { IInventoryTransactionTemplate, IInventoryTransactionTemplatePopulated } from '../models/inventory-transaction-template';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionTemplateService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

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
