import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { InventoryGroup } from 'src/app/models/inventory-group';
import { map, startWith, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { INewInventoryItemData } from 'src/app/models/inventory-item';

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

  @Input() data: INewInventoryItemData;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  headingText: string;
  buttonText: string;

  ngOnInit(): void {
    if (this.data._id) {
      this.headingText = 'Úprava položky zásob'
      this.buttonText = 'Uložit';
      setTimeout(() => this.inventoryItemFG.patchValue(this.data));
    } else {
      this.headingText = 'Nová položka zásob'
      this.buttonText = 'Vytvořit';
    }
  }

  inventoryItemFG: FormGroup = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl(null),
    inventoryGroupId: new FormControl(null)
  });
  inventoryItemFormData$: Observable<INewInventoryItemData> = this.inventoryItemFG.valueChanges.pipe(
    startWith(this.inventoryItemFG)
  );

  inventoryGroupOptions$: Observable<IInventoryGroupOption[]> = this.financialUnitDetailsService.InventoryGroups$.pipe(
    map((groups: InventoryGroup[]) => groups.map((group: InventoryGroup) => {
      const option: IInventoryGroupOption = {
        id: group._id,
        name: group.name
      };
      return option;
    }))
  );

  isCreateButtonDisabled$: Observable<boolean> = this.inventoryItemFormData$.pipe(
    map((formData: INewInventoryItemData) => !(formData.inventoryGroupId && formData.name))
  );

  closeModal(): void {
    this.close.emit();
  }

  createInventoryItem(): void {
    const data: INewInventoryItemData = this.inventoryItemFG.value;
    if (data._id) {
      this.financialUnitDetailsService.updateInventoryItem(data);
    } else {
      this.financialUnitDetailsService.createInventoryItem(data);
    }
    this.closeModal();
  }

  areInventoryItemFormDataValid(formData: INewInventoryItemData): boolean {
    if (!formData.name || !formData.inventoryGroupId) {
      return false;
    }
    return true;
  }
}

interface IInventoryGroupOption {
  id: string;
  name: string;
}