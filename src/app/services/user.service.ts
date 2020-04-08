import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  getFinancialUnitUsers$(financialUnitId: string): Observable<IUser[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IUser[]>(`${this.baseUrl}api/user/get-financial-unit-users`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((users: IUser[]) => users.sort((a, b) => a.displayName.localeCompare(b.displayName)))
    );
  }

  getUsers$(filterText: string): Observable<IUser[]> {
    const params: HttpParams = new HttpParams().append('filterText', filterText);
    return this.http.get<IUser[]>(`${this.baseUrl}api/user/search-users`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((users: IUser[]) => users.sort((a, b) => a.displayName.localeCompare(b.displayName)))
    );
  }
}
