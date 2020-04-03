import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, startWith, tap } from 'rxjs/operators';
import { InventoryItem, IInventoryItemPopulated } from 'src/app/models/inventory-item';
import { FormControl } from '@angular/forms';

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

  listItems$: Observable<ListItem[]> = combineLatest(
    this.financialUnitDetailsService.inventoryItems$,
    this.filterText$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    map(([items, filterText]) => this.getFilteredInventoryItems(items, filterText)),
    map((items: IInventoryItemPopulated[]) => items.map(item => this.getListItemFromInventoryItem(item))),
    tap(() => (this.isLoadingData = false)),
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

  private getFilteredInventoryItems(
    inventoryItems: IInventoryItemPopulated[],
    filterText: string
  ): IInventoryItemPopulated[] {
    return inventoryItems.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));
  }
}
