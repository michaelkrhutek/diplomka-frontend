import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable, combineLatest, of } from 'rxjs';
import { map, startWith, tap, switchMap } from 'rxjs/operators';
import { InventoryGroup, IInventoryGroup, INewInventoryGroupData } from 'src/app/models/inventory-group';
import { StockService } from 'src/app/services/stock.service';
import { FormControl } from '@angular/forms';
import { BasicTable, IBasicTableHeaderInputData, BasicTableActionItemsPosition, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';
import { StockDecrementType } from 'src/app/models/stock';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';
import { InventoryGroupService } from 'src/app/services/inventory-group.service';

@Component({
  selector: 'app-inventory-groups-tab',
  templateUrl: './inventory-groups-tab.component.html',
  styleUrls: ['./inventory-groups-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryGroupsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private stockService: StockService,
    private popUpsService: PopUpsService,
    private inventoryGroupService: InventoryGroupService
  ) { }

  isLoadingData: boolean = true;
  isUpdateInventoryGroupModalData: INewInventoryGroupData = null;

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  inventoryGroups$: Observable<InventoryGroup[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.financialUnitDetailsService.reloadInventoryGroups$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(([financialUnitId]) => financialUnitId ? this.inventoryGroupService.getInventoryGroups$(financialUnitId) : of([])),
  );

  filtredInventoryGroups$: Observable<IInventoryGroup[]> = combineLatest(
    this.inventoryGroups$, this.filterText$
  ).pipe(
    map(([groups, filterText]) => this.getFilteredInventoryGroups(groups, filterText))
  );

  tableData$: Observable<BasicTable> = this.filtredInventoryGroups$.pipe(
    map((groups: InventoryGroup[]) => this.getTableDataFromInventoryGroups(groups)),
    tap(() => (this.isLoadingData = false)),
  );

  private getTableDataFromInventoryGroups(
    groups: InventoryGroup[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 2,
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
    group: InventoryGroup
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'create',
          description: 'Upravit',
          action: () => this.openNewInventoryGroupModal(group)
        },
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

  openNewInventoryGroupModal(inventoryGroup?: IInventoryGroup): void {
    if (inventoryGroup) {
      const newInventoryGroup: INewInventoryGroupData = {
        _id: inventoryGroup._id,
        name: inventoryGroup.name,
        defaultStockDecrementType: inventoryGroup.defaultStockDecrementType
      };
      this.isUpdateInventoryGroupModalData = newInventoryGroup;
    } else {
      const newInventoryGroup: INewInventoryGroupData = { _id: null, name: null, defaultStockDecrementType: null };
      this.isUpdateInventoryGroupModalData = newInventoryGroup;
    }
  }

  closeNewInventoryGroupModal(): void {
    this.isUpdateInventoryGroupModalData = null;
  }

  deleteGroup(account: InventoryGroup): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním skupiny se i smažou všechny její, položky, transakce a účetní zápisy. Opravdu chcete smazat skupinu?',
      action: () => this.financialUnitDetailsService.deleteInventoryGroup(account._id)
    };
    this.popUpsService.openConfirmationModal(data);
  }

  deleteAllGroups(): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním všech skupin se i smažou všechny položky, transakce a účetní zápisy. Opravdu chcete smazat všechny skupiny?',
      action: () => this.financialUnitDetailsService.deleteAllInventoryGroups()
    };
    this.popUpsService.openConfirmationModal(data);
  }

  private getFilteredInventoryGroups(
    inventoryGroups: IInventoryGroup[],
    filterText: string
  ): IInventoryGroup[] {
    return inventoryGroups.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));
  }
}
