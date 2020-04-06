import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IInventoryItemStock, InventoryItemStock } from 'src/app/models/inventory-item-stock';
import { InventoryItemService } from 'src/app/services/inventory-item.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { Form, FormControl } from '@angular/forms';
import { startWith, map, switchMap, tap, take } from 'rxjs/operators';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable, combineLatest, of } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { BasicTable, IBasicTableHeaderInputData, BasicTableActionItemsPosition, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';

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

  isLoadingData: boolean = true;
  stockDetailsModalData: InventoryItemStock = null;

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

  tableData$: Observable<BasicTable> = this.inventoryItemsWithStock$.pipe(
    map((items: IInventoryItemStock[]) => items ? this.getTableDataFromInventoryItemsStocks(items) : null),
    tap(() => (this.isLoadingData = false))
  );

  ngOnInit(): void {
    this.financialUnitDetailsService.lastPeriodEndDate$.pipe(
      take(1),
    ).subscribe((lastPeriodEndDate) => {
      setTimeout(() => this.effectiveDateFC.patchValue(lastPeriodEndDate));
    })
  }

  private getTableDataFromInventoryItemsStocks(
    items: IInventoryItemStock[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 1,
      stickyCells: [
        {
          name: 'ID transakce',
          width: 8,
          align: BasicTableValueAlign.Left
        },
      ],
      otherCells: [
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
        }
      ]
    };
    const rows: IBasicTableRowInputData[] = (items || [])
      .map(item => this.getTableRowDataFromInventoryItemStock(item));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryItemStock(
    item: IInventoryItemStock
  ): IBasicTableRowInputData {
    const costPerUnit: number = item.stock.totalStockQuantity ? item.stock.totalStockCost / item.stock.totalStockQuantity : 0;
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'description',
          description: 'Detaily stavu',
          action: () => this.openStockDetailsModal(item)
        }
      ],
      stickyCells: [
        {
          type: BasicTableRowCellType.Display,
          data: item.inventoryItem.name
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(item.stock.totalStockQuantity)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(costPerUnit, 2)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(item.stock.totalStockCost, 2)
        }
      ]
    }
    return row;
  }

  openStockDetailsModal(itemStock: InventoryItemStock): void {
    this.stockDetailsModalData = itemStock;
  }

  closeStockDetailsModal(): void {
    this.stockDetailsModalData = null;
  }
}
