import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IInventoryTransactionPopulated } from '../models/inventory-transaction';
import { InventoryTransactionType } from '../models/inventory-transaction-type';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getInventoryTransactions$(financialUnitId: string): Observable<IInventoryTransactionPopulated<any>[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryTransactionPopulated<any>[]>(`${this.baseUrl}api/inventory-transaction/get-inventory-transactions`, { params }).pipe(
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
            return 'Úbykte';
        default:
            return 'N/A';
    }
  }
}
