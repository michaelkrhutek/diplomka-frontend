import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map } from 'rxjs/operators';
import { InventoryItem } from 'src/app/models/inventory-item';

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

  isNewInventoryItemModalOpened: boolean = false;

  openNewInventoryItemModalIconItem: IIconItem = {
    description: 'Nová položka zásob',
    iconName: 'add',
    action: () => this.openNewInventoryItemModal()
  };

  listItems$: Observable<ListItem[]> = this.financialUnitDetailsService.inventoryItems$.pipe(
    map((item: InventoryItem[]) => item.map(item => this.getListItemFromInventoryItem(item)))
  );

  private getListItemFromInventoryItem(item: InventoryItem): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'Název položky', value: item.name, width: 16 },
        { label: 'Skupina zásob', value: item.inventoryGroup.name, width: 12 }
      ]
    };
    return new ListItem(data);
  }

  openNewInventoryItemModal(): void {
    this.isNewInventoryItemModalOpened = true;
  }

  closeNewInventoryItemModal(): void {
    this.isNewInventoryItemModalOpened = false;
  }
}
