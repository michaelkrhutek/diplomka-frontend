import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map } from 'rxjs/operators';
import { InventoryItemsGroup } from 'src/app/models/inventory-items-group';
import { group } from '@angular/animations';
import { StockService } from 'src/app/services/stock.service';

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

  isNewInventoryItemsGroupModalOpened: boolean = false;

  openNewInventoryItemsGroupModalIconItem: IIconItem = {
    description: 'New inventory items group',
    iconName: 'add',
    action: () => this.openNewInventoryItemsGroupModal()
  };

  listItems$: Observable<ListItem[]> = this.financialUnitDetailsService.inventoryItemsGroups$.pipe(
    map((groups: InventoryItemsGroup[]) => groups.map(group => this.getListItemFromInventoryItemsGroup(group)))
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
}
