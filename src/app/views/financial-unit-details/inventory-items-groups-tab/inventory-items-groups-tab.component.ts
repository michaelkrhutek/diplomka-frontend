import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, startWith, tap } from 'rxjs/operators';
import { InventoryItemsGroup, IInventoryItemsGroup } from 'src/app/models/inventory-items-group';
import { StockService } from 'src/app/services/stock.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inventory-items-groups-tab',
  templateUrl: './inventory-items-groups-tab.component.html',
  styleUrls: ['./inventory-items-groups-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryItemsGroupsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private stockService: StockService
  ) { }

  isLoadingData: boolean = true;
  isNewInventoryItemsGroupModalOpened: boolean = false;

  openNewInventoryItemsGroupModalIconItem: IIconItem = {
    description: 'New inventory items group',
    iconName: 'add',
    action: () => this.openNewInventoryItemsGroupModal()
  };

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  listItems$: Observable<ListItem[]> = combineLatest(
    this.financialUnitDetailsService.inventoryItemsGroups$,
    this.filterText$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    map(([groups, filterText]) => this.getFilteredInventoryGroups(groups, filterText)),
    map((groups: InventoryItemsGroup[]) => groups.map(group => this.getListItemFromInventoryItemsGroup(group))),
    tap(() => (this.isLoadingData = false)),
  );

  private getListItemFromInventoryItemsGroup(group: InventoryItemsGroup): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'Název skupiny', value: group.name, width: 16 },
        { label: 'Metoda oceňování', value: this.stockService.getStockDecrementTypeDescription(group.defaultStockDecrementType), width: 16 },
      ]
    };
    return new ListItem(data);
  }

  openNewInventoryItemsGroupModal(): void {
    this.isNewInventoryItemsGroupModalOpened = true;
  }

  closeNewInventoryItemsGroupModal(): void {
    this.isNewInventoryItemsGroupModalOpened = false;
  }

  private getFilteredInventoryGroups(
    inventoryGroups: IInventoryItemsGroup[],
    filterText: string
  ): IInventoryItemsGroup[] {
    return inventoryGroups.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));
  }
}
