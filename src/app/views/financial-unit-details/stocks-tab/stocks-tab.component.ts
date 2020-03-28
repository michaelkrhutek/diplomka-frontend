import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IInventoryItemStock } from 'src/app/models/inventory-item-stock';
import { InventoryItemService } from 'src/app/services/inventory-item.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { Form, FormControl } from '@angular/forms';
import { startWith, map, switchMap, tap } from 'rxjs/operators';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable, combineLatest, of } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';

@Component({
  selector: 'app-stocks-tab',
  templateUrl: './stocks-tab.component.html',
  styleUrls: ['./stocks-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StocksTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private inventoryItemService: InventoryItemService,
    private formatterService: FormatterService
  ) { }

  isLoadingData: boolean = false;

  private financialUnitId$: Observable<string> = this.financialUnitDetailsService.financialUnitId$;

  effectiveDateFC: FormControl = new FormControl();
  private selectedEffectiveDate$: Observable<Date> = this.effectiveDateFC.valueChanges.pipe(
    startWith(this.effectiveDateFC.value)
  );

  private inventoryItemsWithStock$: Observable<IInventoryItemStock[]> = combineLatest(this.financialUnitId$, this.selectedEffectiveDate$).pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(([financialUnitId, effectiveDate]) => {
      return effectiveDate ? this.inventoryItemService.getInventoryItemsWithStock$(financialUnitId, effectiveDate) : of([]);
    })
  );

  listItems$: Observable<ListItem[]> = this.inventoryItemsWithStock$.pipe(
    map((item: IInventoryItemStock[]) => item.map(item => this.getListItemFromInventoryItemWithStock(item))),
    tap(() => (this.isLoadingData = false))
  );

  private getListItemFromInventoryItemWithStock(item: IInventoryItemStock): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'Název položky', value: item.inventoryItem.name, width: 16 },
        { label: 'Skupina zásob', value: item.inventoryItem.inventoryGroup.name, width: 12 },
        { label: 'Množství', value: this.formatterService.getRoundedNumberString(item.stock.totalStockQuantity), width: 12 },
        { label: 'Hodnota', value: this.formatterService.getRoundedNumberString(item.stock.totalStockCost), width: 12 }
      ]
    };
    return new ListItem(data);
  }
}
