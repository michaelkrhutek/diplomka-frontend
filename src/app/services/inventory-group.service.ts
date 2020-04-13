import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { InventoryGroup, IInventoryGroup, INewInventoryGroupData } from '../models/inventory-group';
import { catchError, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryGroupService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService,
  ) { }

  getInventoryGroups$(financialUnitId: string): Observable<InventoryGroup[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryGroup[]>(`${this.baseUrl}api/inventory-group/get-all-inventory-groups`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((groups: IInventoryGroup[]) => groups.sort((a, b) => a.name.localeCompare(b.name))),
      map((groups: IInventoryGroup[]) => groups.map(group => new InventoryGroup(group)),
    ));
  }

  getCreateInventoryGroup$(financialUnitId: string, data: INewInventoryGroupData): Observable<'OK'> {
    const params: HttpParams = new HttpParams()
      .append('financialUnitId', financialUnitId)
      .append('name', data.name)
      .append('defaultStockValuationMethod', data.defaultStockValuationMethod)
    return this.http.post<any>(`${this.baseUrl}api/inventory-group/create-inventory-group`, null, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  getUpdateInventoryGroup$(data: INewInventoryGroupData): Observable<'OK'> {
    this.popUpsService.openLoadingModal({ message: 'Upravuji skupinu zásob' });
    const params: HttpParams = new HttpParams()
      .append('id', data._id)
      .append('name', data.name)
      .append('defaultStockValuationMethod', data.defaultStockValuationMethod)
    return this.http.post<any>(`${this.baseUrl}api/inventory-group/update-inventory-group`, null, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
    );
  }

  getDeleteInventoryGroup$(id: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('id', id);
    return this.http.delete<any>(`${this.baseUrl}api/inventory-group/delete-inventory-group`, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }

  deleteAllInventoryGroups$(financialUnitId: string): Observable<'OK'> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.delete<any>(`${this.baseUrl}api/inventory-group/delete-all-inventory-groups`, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res)
    );
  }
}
