import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, startWith, tap } from 'rxjs/operators';
import { InventoryItem, IInventoryItemPopulated } from 'src/app/models/inventory-item';
import { FormControl } from '@angular/forms';
import { BasicTable, IBasicTableHeaderInputData, BasicTableActionItemsPosition, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';

@Component({
  selector: 'app-inventory-items-tab',
  templateUrl: './inventory-items-tab.component.html',
  styleUrls: ['./inventory-items-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryItemsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
  ) { }

  isLoadingData: boolean = true;
  isNewInventoryItemModalOpened: boolean = false;

  openNewInventoryItemModalIconItem: IIconItem = {
    description: 'Nová položka zásob',
    iconName: 'add',
    action: () => this.openNewInventoryItemModal()
  };

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  tableData$: Observable<BasicTable> = combineLatest(
    this.financialUnitDetailsService.inventoryItems$,
    this.filterText$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    map(([items, filterText]) => this.getFilteredInventoryItems(items, filterText)),
    map((items: IInventoryItemPopulated[]) => this.getTableDataFromInventoryItems(items)),
    tap(() => (this.isLoadingData = false)),
  );

  private getTableDataFromInventoryItems(
    items: IInventoryItemPopulated[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 1,
      otherCells: [
        {
          name: 'Název položky',
          width: 12,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Skupina',
          width: 10,
          align: BasicTableValueAlign.Left
        }
      ]
    };
    const rows: IBasicTableRowInputData[] = (items || [])
      .map(item => this.getTableRowDataFromInventoryItem(item));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryItem(
    item: IInventoryItemPopulated
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteItem(item)
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: item.name
        },
        {
          type: BasicTableRowCellType.Display,
          data: item.inventoryGroup.name
        }
      ]
    }
    return row;
  }

  openNewInventoryItemModal(): void {
    this.isNewInventoryItemModalOpened = true;
  }

  closeNewInventoryItemModal(): void {
    this.isNewInventoryItemModalOpened = false;
  }

  deleteItem(item: IInventoryItemPopulated): void {
    // TODO
  }

  deleteAllItems(): void {
    // TODO
  }

  private getFilteredInventoryItems(
    inventoryItems: IInventoryItemPopulated[],
    filterText: string
  ): IInventoryItemPopulated[] {
    return inventoryItems.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));
  }
}
