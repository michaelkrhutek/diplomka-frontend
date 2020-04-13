import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IFinancialAccount } from 'src/app/models/financial-account';
import { INewInventoryTransactionTemplateRequestData } from 'src/app/models/inventory-transaction-template';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { startWith, map } from 'rxjs/operators';
import { IInventoryGroup } from 'src/app/models/inventory-group';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { InventoryTransactionType } from 'src/app/models/inventory-transaction-type';

@Component({
  selector: 'app-new-inventory-transaction-template-modal',
  templateUrl: './new-inventory-transaction-template-modal.component.html',
  styleUrls: ['./new-inventory-transaction-template-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInventoryTransactionTemplateModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private inventoryTransactionService: InventoryTransactionService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  transactionTemplateFG: FormGroup = new FormGroup({
    description: new FormControl(null),
    inventoryGroupId: new FormControl(null),
    transactionType: new FormControl(null),
    debitAccountId: new FormControl(null),
    creditAccountId: new FormControl(null),
    saleDebitAccountId: new FormControl(null),
    saleCreditAccountId: new FormControl(null),
  });
  transactionTemplateFormData$: Observable<INewInventoryTransactionTemplateRequestData> = this.transactionTemplateFG.valueChanges.pipe(
    startWith(this.transactionTemplateFG)
  );

  transactionTypeOptions: ITransactionTypeOption[] = this.inventoryTransactionService.getAllInventoryTransactionTypes()
  .map(type => {
    return {
      type,
      description: this.inventoryTransactionService.getTransactionTypeDescription(type)
    };
  });
  transactionType$: Observable<InventoryTransactionType> = this.transactionTemplateFG.controls['transactionType'].valueChanges.pipe(
    startWith(this.transactionTemplateFG.controls['transactionType'].value)
  )
  inventoryGroups$: Observable<IInventoryGroup[]> = this.financialUnitDetailsService.InventoryGroups$;
  financialAccounts$: Observable<IFinancialAccount[]> = this.financialUnitDetailsService.financialAccounts$;

  isCreateButtonDisabled$: Observable<boolean> = this.transactionTemplateFormData$.pipe(
    map((formData: INewInventoryTransactionTemplateRequestData) => !this.areTransactionTemplateFormDataValid(formData))
  );

  closeModal(): void {
    this.close.emit();
  }

  createTransactionTemplate(): void {
    const formData: INewInventoryTransactionTemplateRequestData = this.transactionTemplateFG.value;
    this.financialUnitDetailsService.createTransactionTemplate(formData);
    this.closeModal();
  }

  areTransactionTemplateFormDataValid(formData: INewInventoryTransactionTemplateRequestData): boolean {
    if (
      !formData.description ||
      !formData.inventoryGroupId ||
      !formData.transactionType ||
      !formData.debitAccountId ||
      !formData.creditAccountId
    ) {
      return false;
    }
    if (formData.transactionType == InventoryTransactionType.Sale && (!formData.debitAccountId || !formData.creditAccountId)) {
      return false;
    }
    return true;
  }
}

interface ITransactionTypeOption {
  type: InventoryTransactionType,
  description: string
}