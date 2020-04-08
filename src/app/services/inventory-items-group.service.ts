import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { InventoryItemsGroup, IInventoryItemsGroup } from '../models/inventory-items-group';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemsGroupService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService,
  ) { }

  getInventoryItemsGroups$(financialUnitId: string): Observable<InventoryItemsGroup[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryItemsGroup[]>(`${this.baseUrl}api/inventory-group/get-all-inventory-groups`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((groups: IInventoryItemsGroup[]) => groups.map(group => new InventoryItemsGroup(group)),
      map((groups: IInventoryItemsGroup[]) => groups.sort((a, b) => a.name.localeCompare(b.name)))
    ));
  }
}
