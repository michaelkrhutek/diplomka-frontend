import { Injectable, Inject } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, filter, finalize } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { SnackbarType } from '../models/snackbar-data';

@Injectable({
  providedIn: 'root'
})
export class FinancialUnitService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  private reloadFinancialUnitsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadFinancialUnits$: Observable<void> = this.reloadFinancialUnitsSource.asObservable();

  getFinancialUnits$(): Observable<IFinancialUnit[]> {
    return this.http.get<IFinancialUnit[]>(`${this.baseUrl}api/financial-unit/get-all-financial-units`, { withCredentials: true }).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getFinancialUnit$(id: string): Observable<IFinancialUnit> {
    const params: HttpParams = new HttpParams().append('id', id);
    const headers: HttpHeaders = new HttpHeaders()
    return this.http.get<IFinancialUnit[]>(`${this.baseUrl}api/financial-unit/get-financial-unit`, { params }).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  createFinancialUnit(name: string): void {
    this.popUpsService.openLoadingModal({ message: 'Vytvářím účetní jednotku' });
    const params: HttpParams = new HttpParams().append('name', name);
    this.http.post<any>(`${this.baseUrl}api/financial-unit/create-financial-unit`, null, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Účetní jednotka byla vytvořena', type: SnackbarType.Success });
      this.reloadFinancialUnitsSource.next();
    });
  }

  deleteFinancialUnit(id: string): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji účetní jednotku' });
    const params: HttpParams = new HttpParams().append('id', id);
    this.http.delete<any>(`${this.baseUrl}api/financial-unit/delete-financial-unit`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Účetní jednotka byla odstraněna', type: SnackbarType.Success });
      this.reloadFinancialUnitsSource.next();
    });
  }
}
