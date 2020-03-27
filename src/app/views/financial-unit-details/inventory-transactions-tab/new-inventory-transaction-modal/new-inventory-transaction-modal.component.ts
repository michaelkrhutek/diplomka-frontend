import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { IInventoryItem } from 'src/app/models/inventory-item';
import { InventoryItemService } from 'src/app/services/inventory-item.service';
import { IInventoryTransactionTemplate } from 'src/app/models/inventory-transaction-template';
import { InventoryTransactionTemplateService } from 'src/app/services/inventory-transaction-template.service';

@Component({
  selector: 'app-new-inventory-transaction-modal',
  templateUrl: './new-inventory-transaction-modal.component.html',
  styleUrls: ['./new-inventory-transaction-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInventoryTransactionModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private inventoryItemService: InventoryItemService,
    private inventoryTransactionTemplateService: InventoryTransactionTemplateService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  financialUnitId$: Observable<string> = this.financialUnitDetailsService.financialUnitId$;

  inventoryItems: Observable<IInventoryItem[]> = this.financialUnitId$.pipe(
    switchMap((financialUnitId: string) => this.inventoryItemService.getInventoryItems$(financialUnitId))
  );

  inventoryItemFC: FormControl = new FormControl();
  selectedInventoryItem$: Observable<IInventoryItem> = this.inventoryItemFC.valueChanges.pipe(
    startWith(this.inventoryItemFC.value)
  );

  inventoryTransactionTemplates$: Observable<IInventoryTransactionTemplate[]> = this.selectedInventoryItem$.pipe(
    switchMap((inventoryItem: IInventoryItem) => this.inventoryTransactionTemplateService.getInventoryGroupTransactionTemplates$(
      inventoryItem.inventoryGroup._id)
    )
  );

  inventoryTransactionTemplateFC: FormControl = new FormControl(null);
  selectedInventoryTransactionTemplate: Observable<IInventoryTransactionTemplate> = this.inventoryTransactionTemplateFC.valueChanges.pipe(
    startWith(this.inventoryTransactionTemplateFC.value)
  );



  closeModal(): void {
    this.close.emit();
  }

  createInventoryTransaction(): void {
    this.closeModal();
  }

  areInventoryTransactionFormDataValid(formData: INewInventoryTransactionFormData): boolean {
    return false;
  }

}


interface INewInventoryTransactionFormData {
  inventoryItem: IInventoryItem;
  description: string;
  effectiveDate: Date;
  // addBeforeTransactionWithIndex?: number;
  debitAccountId: string;
  creditAccountId: string;
}
