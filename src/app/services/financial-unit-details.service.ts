import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { FinancialAccount, INewFinancialAccountData } from '../models/financial-account';
import { switchMap, catchError, map, filter, finalize, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PopUpsService } from './pop-ups.service';
import { FinancialPeriod } from '../models/financial-period';
import { SnackbarType } from '../models/snackbar-data';
import { InventoryGroup, INewInventoryGroupData } from '../models/inventory-group';
import { IInventoryItemPopulated, INewInventoryItemData } from '../models/inventory-item';
import { InventoryTransactionType } from '../models/inventory-transaction-type';
import { INewInventoryTransactionRequestData, IIncrementInventoryTransactionSpecificData, IDecrementInventoryTransactionSpecificData, ISaleInventoryTransactionSpecificData } from '../models/inventory-transaction';
import { InventoryItemService } from './inventory-item.service';
import { FinancialPeriodService } from './financial-period.service';
import { FinancialAccountService } from './financial-account.service';
import { InventoryGroupService } from './inventory-group.service';
import { InventoryTransactionService } from './inventory-transaction.service';
import { InventoryTransactionTemplateService } from './inventory-transaction-template.service';
import { INewInventoryTransactionTemplateRequestData } from '../models/inventory-transaction-template';
import { AuthService } from './auth.service';
import { IFinancialUnit } from '../models/financial-unit';

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
    private inventoryGroupService: InventoryGroupService,
    private inventoryItemService: InventoryItemService,
    private inventoryTransactionTemplateService: InventoryTransactionTemplateService, 
    private inventoryTransactionService: InventoryTransactionService,
    private authService: AuthService
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

  isUserOwner$: Observable<boolean> = combineLatest(this.authService.userId$, this.financialUnit$).pipe(
    map(([userId, unit]) => unit && userId == unit.owner)
  )

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

  createFinancialAccount(data: INewFinancialAccountData): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím finanční účet' });
    this.financialAccountService.getCreateFinancialAccount$(financialUnitId, data).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Finanční účet byl vytvořen', type: SnackbarType.Success });
      this.reloadFinancialAccountsSource.next();
    });
  }

  updateFinancialAccount(data: INewFinancialAccountData): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Upravuji finanční účet' });
    this.financialAccountService.getUpdateFinancialAccount$(data).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Finanční účet byl upraven', type: SnackbarType.Success });
      this.reloadFinancialAccountsSource.next();
      this.reloadTransactionTemplatesSource.next();
    });
  }

  deleteFinancialAccount(id: string): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji účet' });
    this.financialAccountService.getDeleteFinancialAccount$(id).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Účet byl odstraněn', type: SnackbarType.Success });
      this.reloadFinancialAccountsSource.next();
      this.reloadTransactionsSource.next();
      this.reloadTransactionTemplatesSource.next();
    });
  }

  deleteAllFinancialAccounts(): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji účty' });
    this.financialAccountService.getDeleteAllFinancialAccounts$(this.getFinancialUnitId()).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Účty byly odstraněny', type: SnackbarType.Success });
      this.reloadFinancialAccountsSource.next();
      this.reloadTransactionsSource.next();
      this.reloadTransactionTemplatesSource.next();
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
    this.financialPeriodService.getCreateFinancialPeriod$(financialUnitId, startDate, endDate).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Účetní období bylo vytvořeno', type: SnackbarType.Success });
      this.reloadFinancialPeriodsSource.next();
    });
  }

  deleteLastFinancialPeriod(): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji období' });
    this.financialPeriodService.getDeleteLastFinancialPeriod$(financialUnitId).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadFinancialPeriodsSource.next();
      this.popUpsService.showSnackbar({ message: 'Období bylo odstraněno', type: SnackbarType.Success });
    });
  }

  deleteAllFinancialPeriods(): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji období' });
    this.financialPeriodService.getDeleteAllFinancialPeriods$(financialUnitId).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadFinancialPeriodsSource.next();
      this.popUpsService.showSnackbar({ message: 'Období byla odstraněna', type: SnackbarType.Success });
    });
  }

  /*
  Inventory groups
  */

  reloadInventoryGroupsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadInventoryGroups$: Observable<void> = this.reloadInventoryGroupsSource.asObservable();

  InventoryGroups$: Observable<InventoryGroup[]> = combineLatest(this.financialUnitId$, this.reloadInventoryGroups$).pipe(
    switchMap(([financialUnitId]) => financialUnitId ? this.inventoryGroupService.getInventoryGroups$(financialUnitId) : of([])),
    shareReplay(1)
  );

  createInventoryGroup(data: INewInventoryGroupData): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím skupinu zásob' });
    this.inventoryGroupService.getCreateInventoryGroup$(financialUnitId, data).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Skupina zásob byla vytvořena', type: SnackbarType.Success });
      this.reloadInventoryGroupsSource.next();
    });
  }

  updateInventoryGroup(data: INewInventoryGroupData): void {
    this.popUpsService.openLoadingModal({ message: 'Upravuji skupinu zásob' });
    this.inventoryGroupService.getUpdateInventoryGroup$(data).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Skupina zásob byla upravena', type: SnackbarType.Success });
      this.reloadInventoryGroupsSource.next();
      this.reloadInventoryItemsSource.next();
      this.reloadTransactionTemplatesSource.next();
    });
  }

  deleteInventoryGroup(id: string): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji skupinu' });
    this.inventoryGroupService.getDeleteInventoryGroup$(id).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Skupina byla odstraněna', type: SnackbarType.Success });
      this.reloadInventoryGroupsSource.next();
      this.reloadInventoryItemsSource.next();
      this.reloadTransactionTemplatesSource.next();
    });
  }

  deleteAllInventoryGroups(): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji skupinu' });
    this.inventoryGroupService.deleteAllInventoryGroups$(this.getFinancialUnitId()).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadInventoryGroupsSource.next();
      this.reloadInventoryItemsSource.next();
      this.reloadTransactionTemplatesSource.next();
      this.popUpsService.showSnackbar({ message: 'Skupiny byly odstraněny', type: SnackbarType.Success });
    });
  }

  /*
 Inventory items
 */

  reloadInventoryItemsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadInventoryItems$: Observable<void> = this.reloadInventoryItemsSource.asObservable();

  inventoryItems$: Observable<IInventoryItemPopulated[]> = combineLatest(this.financialUnitId$, this.reloadInventoryItems$).pipe(
    switchMap(([financialUnitId]) => financialUnitId ? this.inventoryItemService.getInventoryItems$(financialUnitId) : of([])),
    shareReplay(1)
  );

  createInventoryItem(data: INewInventoryItemData): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím položku zásob' });
    this.inventoryItemService.getCreateInventoryItem$(financialUnitId, data).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Položka zásob byla vytvořena', type: SnackbarType.Success });
      this.reloadInventoryItemsSource.next();
    });
  }

  updateInventoryItem(data: INewInventoryItemData): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Upravuji položku zásob' });
    this.inventoryItemService.getUpdateInventoryItem$(data).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Položka zásob byla upravena', type: SnackbarType.Success });
      this.reloadInventoryItemsSource.next();
    });
  }

  deleteInventoryItem(id: string): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji položku' });
    this.inventoryItemService.getDeleteInventoryItem$(id).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadInventoryItemsSource.next();
      this.popUpsService.showSnackbar({ message: 'Položka byla odstraněna', type: SnackbarType.Success });
    });
  }

  deleteAllInventoryItems(): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji položky' });
    this.inventoryItemService.getDeleteAllInventoryItems$(this.getFinancialUnitId()).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadInventoryItemsSource.next();
      this.popUpsService.showSnackbar({ message: 'Položky byly odstraněny', type: SnackbarType.Success });
    });
  }

  /*
 Transaction templates
 */

  private reloadTransactionTemplatesSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadTransactionTemplates$: Observable<void> = this.reloadTransactionTemplatesSource.asObservable();

  createTransactionTemplate(requestData: INewInventoryTransactionTemplateRequestData): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Vytvářím šablonu transakce' });
    this.inventoryTransactionTemplateService.getCreateTransactionTemplate$(financialUnitId, requestData).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionTemplatesSource.next();
      this.popUpsService.showSnackbar({ message: 'Šablona byla vytvořena', type: SnackbarType.Success });
    });
  }

  deleteTransactionTemplate(id: string): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji šablonu' });
    this.inventoryTransactionTemplateService.getDeleteTransactionTemplate$(id).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionTemplatesSource.next();
      this.popUpsService.showSnackbar({ message: 'Šablona byla odstraněna', type: SnackbarType.Success });
    });
  }

  deleteAllTransactionTemplates(): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji šablony' });
    this.inventoryTransactionTemplateService.getDeleteAllTransactionTemplates$(financialUnitId).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionTemplatesSource.next();
      this.popUpsService.showSnackbar({ message: 'Šablony byly odstraněny', type: SnackbarType.Success });
    });
  }

  /*
  Inventory transactions
  */

  private reloadTransactionsSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadTransactions$: Observable<void> = this.reloadTransactionsSource.asObservable();

  createIncrementInventoryTransaction(
    requestData: INewInventoryTransactionRequestData<IIncrementInventoryTransactionSpecificData>
  ): void {
    this.popUpsService.openLoadingModal({ message: 'Vytvářím transakci' });
    this.inventoryTransactionService.getCreateInventoryTransaction$(
      InventoryTransactionType.Increment, requestData
    ).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionsSource.next();
      this.popUpsService.showSnackbar({ message: 'Transakce byla vytvořena', type: SnackbarType.Success });
    });
  }

  createDecrementInventoryTransaction(
    requestData: INewInventoryTransactionRequestData<IDecrementInventoryTransactionSpecificData>
    ): void {
    this.popUpsService.openLoadingModal({ message: 'Vytvářím transakci' });
    this.inventoryTransactionService.getCreateInventoryTransaction$(
      InventoryTransactionType.Decrement, requestData
    ).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionsSource.next();
      this.popUpsService.showSnackbar({ message: 'Transakce byla vytvořena', type: SnackbarType.Success });
    });
  }

  createSaleInventoryTransaction(
    requestData: INewInventoryTransactionRequestData<ISaleInventoryTransactionSpecificData>
    ): void {
    this.popUpsService.openLoadingModal({ message: 'Vytvářím transakci' });
    this.inventoryTransactionService.getCreateInventoryTransaction$(
      InventoryTransactionType.Sale, requestData
    ).pipe(
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionsSource.next();
      this.popUpsService.showSnackbar({ message: 'Transakce byla vytvořena', type: SnackbarType.Success });
    });
  }

  deleteInventoryTransaction(id: string): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji transakci' });
    const params: HttpParams = new HttpParams().append('id', id);
    this.http.delete<any>(`${this.baseUrl}api/inventory-transaction/delete-inventory-transaction`, { params }).pipe(
      map(() => 'OK'),
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionsSource.next();
      this.popUpsService.showSnackbar({ message: 'Transakce byla odstraněna', type: SnackbarType.Success });
    });
  }

  deleteAllTransactions(): void {
    this.popUpsService.openLoadingModal({ message: 'Odstraňuji transakce' });
    const params: HttpParams = new HttpParams().append('financialUnitId', this.getFinancialUnitId());
    this.http.delete<any>(`${this.baseUrl}api/financial-unit/delete-all-transactions`, { params }).pipe(
      map(() => 'OK'),
      catchError((err: HttpErrorResponse) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.reloadTransactionsSource.next();
      this.popUpsService.showSnackbar({ message: 'Transakce byly odstraněny', type: SnackbarType.Success });
    });
  }

  /*
  User
  */

  private reloadUsersSource: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  reloadUsers$: Observable<void> = this.reloadUsersSource.asObservable();

  addUser(userId: string): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Přidávám uživatele' });
    const params: HttpParams = new HttpParams()
      .append('userId', userId)
      .append('financialUnitId', financialUnitId)
    this.http.post<any>(`${this.baseUrl}api/financial-unit/add-user`, null, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Uživatel byl přidán', type: SnackbarType.Success });
      this.reloadUsersSource.next();
    });
  }

  removeUser(userId: string): void {
    const financialUnitId: string = this.getFinancialUnitId();
    if (!financialUnitId) {
      return null;
    }
    this.popUpsService.openLoadingModal({ message: 'Odebírám uživatele' });
    const params: HttpParams = new HttpParams()
      .append('userId', userId)
      .append('financialUnitId', financialUnitId)
    this.http.post<any>(`${this.baseUrl}api/financial-unit/remove-user`, null, { params }).pipe(
      map(() => 'OK'),
      catchError((err) => {
        this.popUpsService.handleApiError(err);
        return of(null);
      }),
      filter((res: any) => !!res),
      finalize(() => this.popUpsService.closeLoadingModal())
    ).subscribe(() => {
      this.popUpsService.showSnackbar({ message: 'Uživatel byl odebrán', type: SnackbarType.Success });
      this.reloadUsersSource.next();
    });
  }
}
