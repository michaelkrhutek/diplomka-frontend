import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, startWith, take, debounceTime } from 'rxjs/operators';
import { IInventoryTransactionPopulated, InventoryTransactionPopulated } from 'src/app/models/inventory-transaction';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { IInventoryItemPopulated } from 'src/app/models/inventory-item';
import { InventoryTransactionType } from 'src/app/models/inventory-transaction-type';
import { FormGroup, FormControl } from '@angular/forms';
import { IInventoryTransactionFilteringCriteria } from 'src/app/models/inventory-transaction-filtering-criteria';
import { BasicTable, IBasicTableInputData, IBasicTableHeaderInputData, IBasicTableRowInputData, BasicTableRowCellType, BasicTableValueAlign, BasicTableActionItemsPosition } from 'src/app/models/basic-table-models';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';
import { StockService } from 'src/app/services/stock.service';

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
    private formatterService: FormatterService,
    private popUpsService: PopUpsService,
    private stockService: StockService
  ) { }

  isLoadingData: boolean = true;
  isNewInventoryTransactionModalOpened: boolean = false;
  transactionDetailsModalData: IInventoryTransactionPopulated<any> = null;

  inventoryItems$: Observable<IInventoryItemPopulated[]> = this.financialUnitDetailsService.inventoryItems$;

  transactionTypeOptions: ITransactionTypeOption[] = this.inventoryTransactionService.getAllInventoryTransactionTypes()
    .map(type => {
      return {
        type,
        description: this.inventoryTransactionService.getTransactionTypeDescription(type)
      };
    });

  filteringCriteriaFG: FormGroup = new FormGroup({
    inventoryItemId: new FormControl(0),
    transactionType: new FormControl(0),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null)
  });

  private filteringCriteria$: Observable<IInventoryTransactionFilteringCriteria> = this.filteringCriteriaFG.valueChanges.pipe(
    startWith(this.filteringCriteriaFG.value),
    debounceTime(100)
  );

  private inventoryTransactions$: Observable<InventoryTransactionPopulated<any>[]> = combineLatest(
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

  tableData$: Observable<BasicTable> = this.inventoryTransactions$.pipe(
    map((transactions: InventoryTransactionPopulated<any>[]) => this.getTableDataFromInventoryTransactions(transactions)),
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

  private getTableDataFromInventoryTransactions(
    transactions: InventoryTransactionPopulated<any>[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 2,
      stickyCells: [
        {
          name: 'ID transakce',
          width: 6,
          align: BasicTableValueAlign.Left
        },
      ],
      otherCells: [
        {
          name: 'Datum transakce',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Druh transakce',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Položka',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Popisek',
          width: 10,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Vytvořil',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Datum vytvoření',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Oceňovací metoda',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Množství',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Hodnota na jednotku',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Celková hodnota',
          width: 6,
          align: BasicTableValueAlign.Right
        },


      ]
    };
    const rows: IBasicTableRowInputData[] = (transactions || [])
      .map(t => this.getTableRowDataFromInventoryTransaction(t));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryTransaction(
    transaction: InventoryTransactionPopulated<any>
  ): IBasicTableRowInputData {
    const costPerUnit: number = transaction.totalTransactionAmount / (transaction.specificData['quantity'] as number);
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'description',
          description: 'Detaily transakcee',
          action: () => this.openTransactionDetailsModal(transaction)
        },
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteTransaction(transaction._id)
        }
      ],
      stickyCells: [
        {
          type: BasicTableRowCellType.Display,
          data: transaction._id
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getDayMonthYearString(transaction.effectiveDate)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.inventoryTransactionService.getTransactionTypeDescription(transaction.type)
        },
        {
          type: BasicTableRowCellType.Display,
          data: transaction.inventoryItem.name
        },
        {
          type: BasicTableRowCellType.Display,
          data:transaction.description
        },
        {
          type: BasicTableRowCellType.Display,
          data:transaction.creator.displayName
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getDayMonthYearString(transaction.created)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.stockService.getStockDecrementTypeDescription(transaction.stockDecrementTypeApplied)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(transaction.specificData['quantity'] as number)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(costPerUnit, 2)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(transaction.totalTransactionAmount, 2)
        }
      ]
    }
    return row;
  }

  deleteTransaction(id: string): void {
    const data: IConfirmationModalData = {
      message: 'Opravdu chcete smazat transakci?',
      action: () => this.financialUnitDetailsService.deleteInventoryTransaction(id)
    };
    this.popUpsService.openConfirmationModal(data);
  }

  deleteAllTransactions(): void {
    const data: IConfirmationModalData = {
      message: 'Opravdu chcete smazat všechny transakce?',
      action: () => this.financialUnitDetailsService.deleteAllTransactions()
    };
    this.popUpsService.openConfirmationModal(data);
  }

  openNewInventoryTransactionModal(): void {
    this.isNewInventoryTransactionModalOpened = true;
  }

  closeNewInventoryTransactionModal(): void {
    this.isNewInventoryTransactionModalOpened = false;
  }

  openTransactionDetailsModal(transaction: IInventoryTransactionPopulated<any>): void {
    this.transactionDetailsModalData = transaction;
  }

  closeTransactionDetailsModal(): void {
    this.transactionDetailsModalData = null;
  }
}

interface ITransactionTypeOption {
  type: InventoryTransactionType,
  description: string
}