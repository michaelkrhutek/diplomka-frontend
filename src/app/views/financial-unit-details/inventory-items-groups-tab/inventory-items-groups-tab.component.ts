import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { InventoryItemsGroup, IInventoryItemsGroup } from 'src/app/models/inventory-items-group';
import { StockService } from 'src/app/services/stock.service';
import { FormControl } from '@angular/forms';
import { BasicTable, IBasicTableHeaderInputData, BasicTableActionItemsPosition, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';
import { StockDecrementType } from 'src/app/models/stock';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';

@Component({
  selector: 'app-inventory-items-groups-tab',
  templateUrl: './inventory-items-groups-tab.component.html',
  styleUrls: ['./inventory-items-groups-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryItemsGroupsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private stockService: StockService,
    private popUpsService: PopUpsService
  ) { }

  isLoadingData: boolean = true;
  isNewInventoryItemsGroupModalOpened: boolean = false;

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  tableData$: Observable<BasicTable> = combineLatest(
    this.financialUnitDetailsService.inventoryItemsGroups$,
    this.filterText$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    map(([groups, filterText]) => this.getFilteredInventoryGroups(groups, filterText)),
    map((groups: InventoryItemsGroup[]) => this.getTableDataFromInventoryGroups(groups)),
    tap(() => (this.isLoadingData = false)),
  );

  private getTableDataFromInventoryGroups(
    groups: InventoryItemsGroup[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 1,
      otherCells: [
        {
          name: 'Název skupiny',
          width: 12,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Oceňovací metoda',
          width: 10,
          align: BasicTableValueAlign.Left
        }
      ]
    };
    const rows: IBasicTableRowInputData[] = (groups || [])
      .map(group => this.getTableRowDataFromInventoryGroup(group));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryGroup(
    group: InventoryItemsGroup
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteGroup(group)
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: group.name
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.stockService.getStockDecrementTypeDescription(group.defaultStockDecrementType as StockDecrementType)
        }
      ]
    }
    return row;
  }

  openNewInventoryItemsGroupModal(): void {
    this.isNewInventoryItemsGroupModalOpened = true;
  }

  closeNewInventoryItemsGroupModal(): void {
    this.isNewInventoryItemsGroupModalOpened = false;
  }

  deleteGroup(account: InventoryItemsGroup): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním skupiny se i smažou všechny její, položky, transakce a účetní zápisy. Opravdu chcete smazat skupinu?',
      action: () => this.financialUnitDetailsService.deleteInventoryItemsGroup(account._id)
    };
    this.popUpsService.openConfirmationModal(data);
  }

  deleteAllGroups(): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním všech skupin se i smažou všechny položky, transakce a účetní zápisy. Opravdu chcete smazat všechny skupiny?',
      action: () => this.financialUnitDetailsService.deleteAllInventoryItemsGroups()
    };
    this.popUpsService.openConfirmationModal(data);
  }

  private getFilteredInventoryGroups(
    inventoryGroups: IInventoryItemsGroup[],
    filterText: string
  ): IInventoryItemsGroup[] {
    return inventoryGroups.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));
  }
}
