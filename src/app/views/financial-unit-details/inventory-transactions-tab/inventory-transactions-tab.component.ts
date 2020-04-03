import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest, of } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, switchMap, tap, startWith, take, debounceTime } from 'rxjs/operators';
import { IInventoryTransactionPopulated, InventoryTransactionPopulated } from 'src/app/models/inventory-transaction';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { IInventoryItemPopulated, IInventoryItem } from 'src/app/models/inventory-item';
import { InventoryTransactionType } from 'src/app/models/inventory-transaction-type';
import { FormGroup, FormControl } from '@angular/forms';
import { IFinancialTransactionsFilteringCriteria } from 'src/app/models/financial-transactions-filtering-criteria';
import { IInventoryTransactionFilteringCriteria } from 'src/app/models/inventory-transaction-filtering-criteria';

@Component({
  selector: 'app-inventory-transactions-tab',
  templateUrl: './inventory-transactions-tab.component.html',
  styleUrls: ['./inventory-transactions-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTransactionsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private inventoryTransactionService: InventoryTransactionService,
    private formatterService: FormatterService
  ) { }

  isLoadingData: boolean = true;
  isNewInventoryTransactionModalOpened: boolean = false;

  inventoryItems$: Observable<IInventoryItemPopulated[]> = this.financialUnitDetailsService.inventoryItems$;

  transactionTypeOptions: ITransactionTypeOption[] = this.inventoryTransactionService.getAllInventoryTransactionTypes()
    .map(type => {
      return {
        type,
        description: this.inventoryTransactionService.getTransactionTypeDescription(type)
      };
    });

  filteringCriteriaFG: FormGroup = new FormGroup({
    inventoryItemId: new FormControl(null),
    transactionType: new FormControl(null),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null)
  });

  private filteringCriteria$: Observable<IInventoryTransactionFilteringCriteria> = this.filteringCriteriaFG.valueChanges.pipe(
    startWith(this.filteringCriteriaFG.value),
    debounceTime(100)
  );

  openNewInventoryTransactionModalIconItem: IIconItem = {
    description: 'Nová transakce',
    iconName: 'add',
    action: () => this.openNewInventoryTransactionModal()
  };

  inventoryTransactions$: Observable<InventoryTransactionPopulated<any>[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.filteringCriteria$,
    this.financialUnitDetailsService.reloadTransactions$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(([financialUnitId, filteringCriteria]) => {
      return financialUnitId && filteringCriteria ?
        this.inventoryTransactionService.getFiltredInventoryTransactions$(financialUnitId, filteringCriteria) :
        of([]);
    }),
  );

  listItems$: Observable<ListItem[]> = this.inventoryTransactions$.pipe(
    map((transactions: InventoryTransactionPopulated<any>[]) => transactions.map(transaction => this.getListItemFromInventoryTransaction(transaction))),
    tap(() => (this.isLoadingData = false)),
  );

  ngOnInit(): void {
    combineLatest(
      this.financialUnitDetailsService.firstPeriodStartDate$,
      this.financialUnitDetailsService.lastPeriodEndDate$
    ).pipe(
      take(1)
    ).subscribe(([dateFrom, dateTo]) => {
      setTimeout(() => this.filteringCriteriaFG.patchValue({ dateFrom, dateTo }));
    })
  }

  private getListItemFromInventoryTransaction(transaction: InventoryTransactionPopulated<any>): ListItem {
    const costPerUnit: number = transaction.totalTransactionAmount / (transaction.specificData['quantity'] as number);
    const data: IListItem = {
      textItems: [
        { label: 'ID transakce', value: transaction._id, width: 14 },
        { label: 'Datum', value: this.formatterService.getDayMonthYearString(transaction.effectiveDate), width: 8 },
        { label: 'Položka', value: transaction.inventoryItem.name, width: 10 },
        { label: 'Druh transakce', value: this.inventoryTransactionService.getTransactionTypeDescription(transaction.type), width: 8 },
        { label: 'Popisek', value: transaction.description, width: 16 },
        { label: 'Množství', value: this.formatterService.getRoundedNumberString(transaction.specificData['quantity'] as number), width: 8 },
        { label: 'Hodnota na jednotku', value: this.formatterService.getRoundedNumberString(costPerUnit, 2), width: 8 },
        { label: 'Celková hodnota', value: this.formatterService.getRoundedNumberString(transaction.totalTransactionAmount), width: 8 },
        // { label: 'Množství po transakci', value: transaction.stock.totalStockQuantity.toString(), width: 6 },
        // { label: 'Celková hodnota po transakci', value: transaction.stock.totalStockQuantity.toString(), width: 6 },
        // { label: 'Hodnota na jednotku po transakci', value: transaction.stock.totalStockQuantity.toString(), width: 6 }
      ],
      iconItemsEnd: [
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.financialUnitDetailsService.deleteInventoryTransaction(transaction._id)
        }
      ],
      iconItemsEndContainerWidth: 1
    };
    return new ListItem(data);
  }

  deleteAllTransactions(): void {
    this.financialUnitDetailsService.deleteAllTransactions();
  }

  openNewInventoryTransactionModal(): void {
    this.isNewInventoryTransactionModalOpened = true;
  }

  closeNewInventoryTransactionModal(): void {
    this.isNewInventoryTransactionModalOpened = false;
  }
}

interface ITransactionTypeOption {
  type: InventoryTransactionType,
  description: string
}