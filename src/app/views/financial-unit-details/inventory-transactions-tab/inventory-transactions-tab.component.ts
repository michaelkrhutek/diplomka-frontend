import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, switchMap } from 'rxjs/operators';
import { IInventoryTransactionPopulated } from 'src/app/models/inventory-transaction';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { FormatterService } from 'src/app/services/formatter.service';

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

  isNewInventoryTransactionModalOpened: boolean = false;

  openNewInventoryTransactionModalIconItem: IIconItem = {
    description: 'Nová transakce',
    iconName: 'add',
    action: () => this.openNewInventoryTransactionModal()
  };

  inventoryTransactions$: Observable<IInventoryTransactionPopulated<any>[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.financialUnitDetailsService.reloadTransactions$
  ).pipe(
    switchMap(([financialUnitId]) => this.inventoryTransactionService.getInventoryTransactions$(financialUnitId))
  );

  listItems$: Observable<ListItem[]> = this.inventoryTransactions$.pipe(
    map((transactions: IInventoryTransactionPopulated<any>[]) => transactions.map(transaction => this.getListItemFromInventoryTransaction(transaction)))
  );

  private getListItemFromInventoryTransaction(transaction: IInventoryTransactionPopulated<any>): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'Datum', value: this.formatterService.getDayMonthYearString(transaction.effectiveDate), width: 8 },
        { label: 'Položka', value: transaction.inventoryItem.name, width: 12 },
        { label: 'Druh transakce', value: this.inventoryTransactionService.getTransactionTypeDescription(transaction.type), width: 8 },
        { label: 'Popisek', value: transaction.description, width: 16 },
        { label: 'Množství', value: (transaction.specificData['quantity'] as number).toString(), width: 8 },
        { label: 'Stav po transakci', value: transaction.stock.totalStockQuantity.toString(), width: 8 }
      ]
    };
    return new ListItem(data);
  }

  openNewInventoryTransactionModal(): void {
    this.isNewInventoryTransactionModalOpened = true;
  }

  closeNewInventoryTransactionModal(): void {
    this.isNewInventoryTransactionModalOpened = false;
  }

}
