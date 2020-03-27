import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { InventoryItemsGroup } from 'src/app/models/inventory-items-group';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-inventory-item-modal',
  templateUrl: './new-inventory-item-modal.component.html',
  styleUrls: ['./new-inventory-item-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInventoryItemModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  nameFC: FormControl = new FormControl(null);
  inventoryItemsGroupIdFC: FormControl = new FormControl(null);

  inventoryItemFG: FormGroup = new FormGroup({
    name: this.nameFC,
    inventoryItemsGroupId: this.inventoryItemsGroupIdFC
  });
  inventoryItemFormData$: Observable<INewInventoryItemFormData> = this.inventoryItemFG.valueChanges.pipe(
    startWith(this.inventoryItemFG)
  );

  inventoryItemsGroupOptions$: Observable<IInventoryItemsGroupOption[]> = this.financialUnitDetailsService.inventoryItemsGroups$.pipe(
    map((groups: InventoryItemsGroup[]) => groups.map((group: InventoryItemsGroup) => {
      const option: IInventoryItemsGroupOption = {
        id: group._id,
        name: group.name
      };
      return option;
    }))
  );

  closeModal(): void {
    this.close.emit();
  }

  createInventoryItem(): void {
    const formData: INewInventoryItemFormData = this.inventoryItemFG.value;
    this.financialUnitDetailsService.createInventoryItem(formData.name, formData.inventoryItemsGroupId);
    this.closeModal();
  }

  areInventoryItemFormDataValid(formData: INewInventoryItemFormData): boolean {
    if (!formData.name || !formData.inventoryItemsGroupId) {
      return false;
    }
    return true;
  }
}

interface IInventoryItemsGroupOption {
  id: string;
  name: string;
}

interface INewInventoryItemFormData {
  name: string;
  inventoryItemsGroupId: string;
}
