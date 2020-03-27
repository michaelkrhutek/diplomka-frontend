import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { FinancialAccount, IFinancialAccount } from '../models/financial-account';
import { switchMap, catchError, map, filter, finalize, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { IFinancialPeriod, FinancialPeriod } from '../models/financial-period';
import { SnackbarType } from '../models/snackbar-data';
import { InventoryItemsGroup, IInventoryItemsGroup } from '../models/inventory-items-group';
import { InventoryItem, IInventoryItem } from '../models/inventory-item';
import { StockDecrementType } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class FinancialUnitDetailsService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService
  ) { }

  /*
  Financial unit
  */

  private financialUnitSource: BehaviorSubject<IFinancialUnit> = new BehaviorSubject<IFinancialUnit>(null);
  financialUnit$: Observable<IFinancialUnit> = this.financialUnitSource.asObservable().pipe(
    shareReplay(1)
  );
  financialUnitId$: Observable<string> = this.financialUnit$.pipe(
    map((financialUnit: IFinancialUnit) => financialUnit ? financialUnit._id : null),
    shareReplay(1)
  );

  getFinancialUnitId(): string {
    const financialUnit: IFinancialUnit = this.financialUnitSource.getValue();
    return financialUnit ? financialUnit._id : null;
  }

  setFinancialUnit(financialUnit: IFinancialUnit): void {
    this.financialUnitSource.next(financialUnit);
  }

  /*
  Financial accounts
  */

  reloadFinancialAccountsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadFinancialAccounts$: Observable<void> = this.reloadFinancialAccountsSource.asObservable();

  financialAccounts$: Observable<FinancialAccount[]> = combineLatest(this.financialUnitId$, this.reloadFinancialAccounts$).pipe(
    switchMap(([financialUnitId]) => financialUnitId ? this.getFinancialAccounts$(financialUnitId) : of([])),
    shareReplay(1)
  );

  getFinancialAccounts$(financialUnitId: string): Observable<FinancialAccount[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IFinancialAccount[]>(`${this.baseUrl}api/financial-account/get-all-financial-accounts`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((accounts: IFinancialAccount[]) => accounts.map(account => new FinancialAccount(account))),
      tap(v => console.log(v))
    );
  }

  createFinancialAccount(name: string, code: string): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím finanční účet' });
    const params: HttpParams = new HttpParams()
      .append('name', name)
      .append('code', code)
      .append('financialUnitId', financialUnitId)
    this.http.post<any>(`${this.baseUrl}api/financial-account/create-financial-account`, null, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Finanční účet byl vytvořen', type: SnackbarType.Success });
      this.reloadFinancialAccountsSource.next();
    });
  }

  /*
  Financial periods
  */

  reloadFinancialPeriodsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadFinancialPeriods$: Observable<void> = this.reloadFinancialPeriodsSource.asObservable().pipe(
    shareReplay(1)
  );

  financialPeriods$: Observable<FinancialPeriod[]> = combineLatest(this.financialUnitId$, this.reloadFinancialPeriods$).pipe(
    switchMap(([financialUnitId]) => financialUnitId ? this.getFinancialPeriods$(financialUnitId) : of([])),
    shareReplay(1)
  );

  getFinancialPeriods$(financialUnitId: string): Observable<FinancialPeriod[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IFinancialPeriod[]>(`${this.baseUrl}api/financial-period/get-all-financial-periods`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((financialPeriods: IFinancialPeriod[]) => {
        const unsortedFinancialPeriods: IFinancialPeriod[] = financialPeriods.map(financialPeriod => new FinancialPeriod(financialPeriod));
        return unsortedFinancialPeriods.sort((a, b) => a.startDate.getMilliseconds() - b.startDate.getMilliseconds());
      })
    );
  }

  createFinancialPeriod(startDate: Date, endDate: Date): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím účetní období' });
    const params: HttpParams = new HttpParams()
      .append('startDate', startDate.toDateString())
      .append('endDate', endDate.toDateString())
      .append('financialUnitId', financialUnitId)
    this.http.post<any>(`${this.baseUrl}api/financial-period/create-financial-period`, null, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Účetní období bylo vytvořeno', type: SnackbarType.Success });
      this.reloadFinancialPeriodsSource.next();
    });
  }

  /*
  Inventory items groups
  */

  reloadInventoryItemsGroupsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadInventoryItemsGroups$: Observable<void> = this.reloadInventoryItemsGroupsSource.asObservable();

  inventoryItemsGroups$: Observable<InventoryItemsGroup[]> = combineLatest(this.financialUnitId$, this.reloadInventoryItemsGroups$).pipe(
    switchMap(([financialUnitId]) => financialUnitId ? this.getInventoryItemsGroups$(financialUnitId) : of([])),
    shareReplay(1)
  );

  getInventoryItemsGroups$(financialUnitId: string): Observable<InventoryItemsGroup[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryItemsGroup[]>(`${this.baseUrl}api/inventory-group/get-all-inventory-groups`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((groups: IInventoryItemsGroup[]) => groups.map(group => new InventoryItemsGroup(group))),
      tap(v => console.log(v))
    );
  }

  getInventoryItemGroupName$(groupId: string): Observable<string> {
    return this.inventoryItemsGroups$.pipe(
      map((groups: InventoryItemsGroup[]) => {
        const group: InventoryItemsGroup = groups.find(group => group._id == groupId);
        return group ? group.name : 'N/A';
      })
    );
  }

  createInventoryItemsGroup(name: string, defaultStockDecrementType: StockDecrementType): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím skupinu zásob' });
    const params: HttpParams = new HttpParams()
      .append('name', name)
      .append('financialUnitId', financialUnitId)
      .append('defaultStockDecrementType', defaultStockDecrementType)
    this.http.post<any>(`${this.baseUrl}api/inventory-group/create-inventory-group`, null, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Skupina zásob byla vytvořena', type: SnackbarType.Success });
      this.reloadInventoryItemsGroupsSource.next();
    });
  }

  /*
 Inventory items groups
 */

  reloadInventoryItemsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadInventoryItems$: Observable<void> = this.reloadInventoryItemsSource.asObservable();

  inventoryItems$: Observable<InventoryItem[]> = combineLatest(this.financialUnitId$, this.reloadInventoryItems$).pipe(
    switchMap(([financialUnitId]) => financialUnitId ? this.getInventoryItems$(financialUnitId) : of([])),
    shareReplay(1)
  );

  getInventoryItems$(financialUnitId: string): Observable<InventoryItem[]> {
    const params: HttpParams = new HttpParams().append('financialUnitId', financialUnitId);
    return this.http.get<IInventoryItem[]>(`${this.baseUrl}api/inventory-item/get-all-inventory-items`, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of([]);
      }),
      map((groups: IInventoryItem[]) => groups.map(group => new InventoryItem(group))),
    );
  }

  createInventoryItem(name: string, inventoryGroupId: string): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím položku zásob' });
    const params: HttpParams = new HttpParams()
      .append('name', name)
      .append('inventoryGroupId', inventoryGroupId)
      .append('financialUnitId', financialUnitId)
    this.http.post<any>(`${this.baseUrl}api/inventory-item/create-inventory-item`, null, { params }).pipe(
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Položka zásob byla vytvořena', type: SnackbarType.Success });
      this.reloadInventoryItemsSource.next();
    });
  }


  private reloadInventoryTransactionsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadInventoryTransactions$: Observable<void> = this.reloadInventoryTransactionsSource.asObservable();
}
