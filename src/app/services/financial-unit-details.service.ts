import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { FinancialAccount, IFinancialAccount } from '../models/financial-account';
import { switchMap, catchError, map, filter, finalize, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { IFinancialPeriod, FinancialPeriod } from '../models/financial-period';
import { SnackbarType } from '../models/snackbar-data';
import { InventoryItemsGroup, IInventoryItemsGroup } from '../models/inventory-items-group';
import { InventoryItem, IInventoryItem, IInventoryItemPopulated } from '../models/inventory-item';
import { StockDecrementType } from '../models/stock';
import { InventoryTransactionType } from '../models/inventory-transaction-type';
import { INewInventoryTransactionRequestData, IIncrementInventoryTransactionSpecificData, IDecrementInventoryTransactionSpecificData } from '../models/inventory-transaction';
import { InventoryItemService } from './inventory-item.service';
import { FinancialPeriodService } from './financial-period.service';
import { FinancialAccountService } from './financial-account.service';
import { InventoryItemsGroupService } from './inventory-items-group.service';
import { InventoryTransactionService } from './inventory-transaction.service';
import { FinancialTransactionService } from './financial-transaction.service';
import { InventoryTransactionTemplateService } from './inventory-transaction-template.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialUnitDetailsService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private popUpsService: PopUpsService,
    private financialPeriodService: FinancialPeriodService,
    private financialAccountService: FinancialAccountService,
    private inventoryGroupService: InventoryItemsGroupService,
    private inventoryItemService: InventoryItemService,
    private inventoryTransactionTemplateService: InventoryTransactionTemplateService,
    private inventoryTransactionService: InventoryTransactionService,
    private financialTransactionService: FinancialTransactionService
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
    switchMap(([financialUnitId]) => financialUnitId ? this.financialAccountService.getFinancialAccounts$(financialUnitId) : of([])),
    shareReplay(1)
  );

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
    switchMap(([financialUnitId]) => financialUnitId ? this.financialPeriodService.getFinancialPeriods$(financialUnitId) : of([])),
    shareReplay(1)
  );

  firstPeriodStartDate$: Observable<Date | null> = this.financialPeriods$.pipe(
    map((periods) => {
      if (periods.length == 0) {
        return null;
      }
      return periods[0].startDate;
    })
  );

  lastPeriodEndDate$: Observable<Date | null> = this.financialPeriods$.pipe(
    map((periods) => {
      if (periods.length == 0) {
        return null;
      }
      return periods[periods.length - 1].endDate;
    })
  );

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
    switchMap(([financialUnitId]) => financialUnitId ? this.inventoryGroupService.getInventoryItemsGroups$(financialUnitId) : of([])),
    shareReplay(1)
  );

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

  inventoryItems$: Observable<IInventoryItemPopulated[]> = combineLatest(this.financialUnitId$, this.reloadInventoryItems$).pipe(
    switchMap(([financialUnitId]) => financialUnitId ? this.inventoryItemService.getInventoryItems$(financialUnitId) : of([])),
    shareReplay(1)
  );

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



  private reloadTransactionsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadTransactions$: Observable<void> = this.reloadTransactionsSource.asObservable();

  private getCreateInventoryTransaction$(
    transactionType: InventoryTransactionType,
    requestData: INewInventoryTransactionRequestData<any>
  ): Observable<any> {
    this.popUpsService.openLoadingModal({ message: 'Vytvářím transakci' });
    const headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');
    const params: HttpParams = new HttpParams().append('type', transactionType);
    return this.http.post<any>(
      `${this.baseUrl}api/inventory-transaction/create-inventory-transaction`, JSON.stringify(requestData),
      { headers, params }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    );
  }

  createIncrementInventoryTransaction(requestData: INewInventoryTransactionRequestData<IIncrementInventoryTransactionSpecificData>): void {
    this.getCreateInventoryTransaction$(InventoryTransactionType.Increment, requestData).subscribe(() => {
      this.reloadTransactionsSource.next();
      this.popUpsService.showSnackbar({ message: 'Transakce byla vytvořena', type: SnackbarType.Success });
    });
  }

  createDecrementInventoryTransaction(requestData: INewInventoryTransactionRequestData<IDecrementInventoryTransactionSpecificData>): void {
    this.getCreateInventoryTransaction$(InventoryTransactionType.Decrement, requestData).subscribe(() => {
      this.reloadTransactionsSource.next();
      this.popUpsService.showSnackbar({ message: 'Transakce byla vytvořena', type: SnackbarType.Success });
    });
  }
}
