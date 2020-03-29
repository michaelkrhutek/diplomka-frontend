import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, switchMap, tap } from 'rxjs/operators';
import { IInventoryTransactionPopulated, InventoryTransactionPopulated } from 'src/app/models/inventory-transaction';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { IInventoryItemPopulated } from 'src/app/models/inventory-item';
import { InventoryTransactionType } from 'src/app/models/inventory-transaction-type';

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

  isLoadingData: boolean = false;
  isNewInventoryTransactionModalOpened: boolean = false;

  openNewInventoryTransactionModalIconItem: IIconItem = {
    description: 'Nová transakce',
    iconName: 'add',
    action: () => this.openNewInventoryTransactionModal()
  };

  inventoryTransactions$: Observable<InventoryTransactionPopulated<any>[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.financialUnitDetailsService.reloadTransactions$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(([financialUnitId]) => this.inventoryTransactionService.getInventoryTransactions$(financialUnitId)),
  );

  listItems$: Observable<ListItem[]> = this.inventoryTransactions$.pipe(
    map((transactions: InventoryTransactionPopulated<any>[]) => transactions.map(transaction => this.getListItemFromInventoryTransaction(transaction))),
    tap(() => (this.isLoadingData = false)),
  );

  private getListItemFromInventoryTransaction(transaction: InventoryTransactionPopulated<any>): ListItem {
    const costPerUnit: number = transaction.totalTransactionAmount / (transaction.specificData['quantity'] as number);
    const data: IListItem = {
      textItems: [
        { label: 'ID transakce', value: transaction._id, width: 14 },
        { label: 'Datum', value: this.formatterService.getDayMonthYearString(transaction.effectiveDate), width: 8 },
        { label: 'Položka', value: transaction.inventoryItem.name, width: 10 },
        { label: 'Druh transakce', value: this.inventoryTransactionService.getTransactionTypeDescription(transaction.type), width: 8 },
        { label: 'Popisek', value: transaction.description, width: 16 },
        { label: 'Množství', value: (transaction.specificData['quantity'] as number).toString(), width: 8 },
        { label: 'Hodnota na jednotku', value: costPerUnit.toString(), width: 8 },
        { label: 'Celková hodnota', value: transaction.totalTransactionAmount.toString(), width: 8 },
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
