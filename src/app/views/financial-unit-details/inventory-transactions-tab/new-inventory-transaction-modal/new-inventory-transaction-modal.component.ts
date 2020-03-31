import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, combineLatest, Subscription } from 'rxjs';
import { startWith, switchMap, map, tap } from 'rxjs/operators';
import { IInventoryItem, IInventoryItemPopulated } from 'src/app/models/inventory-item';
import { IInventoryTransactionTemplatePopulated } from 'src/app/models/inventory-transaction-template';
import { InventoryTransactionTemplateService } from 'src/app/services/inventory-transaction-template.service';
import { InventoryTransactionType } from 'src/app/models/inventory-transaction-type';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { IFinancialAccount } from 'src/app/models/financial-account';
import { INewInventoryTransactionRequestData, IIncrementInventoryTransactionSpecificData, IDecrementInventoryTransactionSpecificData } from 'src/app/models/inventory-transaction';

@Component({
  selector: 'app-new-inventory-transaction-modal',
  templateUrl: './new-inventory-transaction-modal.component.html',
  styleUrls: ['./new-inventory-transaction-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInventoryTransactionModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private inventoryTransactionTemplateService: InventoryTransactionTemplateService,
    private inventoryTransactionService: InventoryTransactionService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  financialUnitId$: Observable<string> = this.financialUnitDetailsService.financialUnitId$;

  inventoryItems$: Observable<IInventoryItemPopulated[]> = this.financialUnitDetailsService.inventoryItems$;
  inventoryItemFC: FormControl = new FormControl();
  selectedInventoryItem$: Observable<IInventoryItemPopulated> = this.inventoryItemFC.valueChanges.pipe(
    startWith(this.inventoryItemFC.value),
    tap(() => this.inventoryTransactionTemplateFC.patchValue(null))
  );

  inventoryTransactionTemplates$: Observable<IInventoryTransactionTemplatePopulated[]> = this.selectedInventoryItem$.pipe(
    switchMap((inventoryItem: IInventoryItemPopulated) => {
      return inventoryItem ? 
        this.inventoryTransactionTemplateService.getInventoryGroupTransactionTemplates$(inventoryItem.inventoryGroup._id) :
        of([]);
    })
  );
  inventoryTransactionTemplateFC: FormControl = new FormControl(null);
  selectedInventoryTransactionTemplate$: Observable<IInventoryTransactionTemplatePopulated> = this.inventoryTransactionTemplateFC.valueChanges.pipe(
    startWith(this.inventoryTransactionTemplateFC.value),
    tap((template: IInventoryTransactionTemplatePopulated) => {
      if (template) {
        this.transactionTypeFC.patchValue(template.transactionType)
        this.descriptionFC.patchValue(template.description)
        this.debitAccountIdFC.patchValue(template.debitAccount._id)
        this.creditAccountIdFC.patchValue(template.creditAccount._id)
      }
    })
  );

  transactionTypeOptions: ITransactionTypeOption[] = this.inventoryTransactionService.getAllInventoryTransactionTypes()
    .map(type => {
      return {
        type,
        description: this.inventoryTransactionService.getTransactionTypeDescription(type)
      };
    });
  transactionTypeFC: FormControl = new FormControl(null);
  selectedTransactionType$: Observable<InventoryTransactionType> = this.transactionTypeFC.valueChanges.pipe(
    startWith(this.transactionTypeFC.value)
  );

  descriptionFC: FormControl = new FormControl(null);

  minimalEffectiveDate$: Observable<Date | null> = this.financialUnitDetailsService.firstPeriodStartDate$;
  maximalEffectiveDate$: Observable<Date | null> = this.financialUnitDetailsService.lastPeriodEndDate$;
  isEffectiveDateDisabled$: Observable<boolean> = combineLatest(
    this.minimalEffectiveDate$, this.maximalEffectiveDate$).pipe(
      map(([minDate, maxDate]) => !(minDate && maxDate))
  );
  effectiveDateFC: FormControl = new FormControl(null);

  financialAccounts$: Observable<IFinancialAccount[]> = this.financialUnitDetailsService.financialAccounts$;
  debitAccountIdFC: FormControl = new FormControl(null);
  creditAccountIdFC: FormControl = new FormControl(null);

  newInventoryTransactionFG: FormGroup = new FormGroup({
    inventoryItem: this.inventoryItemFC,
    description: this.descriptionFC,
    effectiveDate: this.effectiveDateFC,
    debitAccountId: this.debitAccountIdFC,
    creditAccountId: this.creditAccountIdFC
  });
  newInventoryTransactionData$: Observable<INewInventoryTransactionFormData> = this.newInventoryTransactionFG.valueChanges.pipe(
    startWith(this.newInventoryTransactionFG.value)
  );

  incrementTransactionSpecificDataFG: FormGroup = new FormGroup({
    quantity: new FormControl(0),
    costPerUnit: new FormControl(0)
  });
  incrementTransactionSpecificData$: Observable<IIncrementInventoryTransactionSpecificData> = this.incrementTransactionSpecificDataFG.valueChanges.pipe(
    startWith(this.incrementTransactionSpecificDataFG.value)
  )

  decrementTransactionSpecificDataFG: FormGroup = new FormGroup({
    quantity: new FormControl(0),
  });
  decrementTransactionSpecificData$: Observable<IDecrementInventoryTransactionSpecificData> = this.decrementTransactionSpecificDataFG.valueChanges.pipe(
    startWith(this.decrementTransactionSpecificDataFG.value)
  )

  transactionSpecificData$: Observable<any> = this.selectedTransactionType$.pipe(
    switchMap((transactionType) => {
      switch (transactionType) {
        case InventoryTransactionType.Increment:
          return this.incrementTransactionSpecificData$;
        case InventoryTransactionType.Decrement:
          return this.decrementTransactionSpecificData$;
        default:
          return of(null);
      }
    })
  );

  isCreateButtonDisabled$: Observable<boolean> = combineLatest(
    this.selectedTransactionType$,
    this.newInventoryTransactionData$,
    this.transactionSpecificData$
  ).pipe(
    map(([transactionType, transactionData, specificData]) => {
      const areInventoryTransactionFormDataValid: boolean = this.getAreInventoryTransactionFormDataValid(transactionData);
      const areSpecificDataValid: boolean = this.getAreSpecificDataValid(transactionType, specificData);
      return !(areInventoryTransactionFormDataValid && areSpecificDataValid);
    }),
  )

  isEffectiveDateDisabledSubscription: Subscription;
  selectedTemplateSubscription: Subscription;

  ngOnInit(): void {
    this.isEffectiveDateDisabledSubscription = this.isEffectiveDateDisabled$
      .subscribe((isDisabled) => isDisabled ? this.effectiveDateFC.disable() : this.effectiveDateFC.enable());
    this.selectedTemplateSubscription = this.selectedInventoryTransactionTemplate$.subscribe();
  }

  ngOnDestroy(): void {
    this.isEffectiveDateDisabledSubscription && this.isEffectiveDateDisabledSubscription.unsubscribe();
    this.selectedTemplateSubscription && this.selectedTemplateSubscription.unsubscribe();    
  }

  closeModal(): void {
    this.close.emit();
  }

  createInventoryTransaction(): void {
    const transactionType: InventoryTransactionType = this.transactionTypeFC.value;
    const formData: INewInventoryTransactionFormData = this.newInventoryTransactionFG.value;
    if (transactionType == InventoryTransactionType.Increment) {
      const specificData: IIncrementInventoryTransactionSpecificData = this.incrementTransactionSpecificDataFG.value;
      const requestData: INewInventoryTransactionRequestData<IIncrementInventoryTransactionSpecificData> = {
        inventoryItemId: formData.inventoryItem._id,
        effectiveDate: formData.effectiveDate,
        description: formData.description,
        debitAccountId: formData.debitAccountId,
        creditAccountId: formData.creditAccountId,
        specificData
      };
      this.financialUnitDetailsService.createIncrementInventoryTransaction(requestData);
    } else if (transactionType == InventoryTransactionType.Decrement) {
      const specificData: IIncrementInventoryTransactionSpecificData = this.decrementTransactionSpecificDataFG.value;
      const requestData: INewInventoryTransactionRequestData<IDecrementInventoryTransactionSpecificData> = {
        inventoryItemId: formData.inventoryItem._id,
        effectiveDate: formData.effectiveDate,
        description: formData.description,
        debitAccountId: formData.debitAccountId,
        creditAccountId: formData.creditAccountId,
        specificData
      };
      this.financialUnitDetailsService.createDecrementInventoryTransaction(requestData);
    }
    this.closeModal();
  }

  private getAreInventoryTransactionFormDataValid(formData: INewInventoryTransactionFormData): boolean {
    console.log(formData)
    if (
      !formData.inventoryItem ||
      !formData.description ||
      !formData.effectiveDate ||
      !formData.debitAccountId ||
      !formData.creditAccountId
    ) {
      return false;
    }
    return true;
  }

  private getAreSpecificDataValid(type: InventoryTransactionType, specificData: any): boolean {
    console.log(type, specificData)
    if (!type || !specificData) {
      return false;
    }
    if (type == InventoryTransactionType.Increment) {
      const data: IIncrementInventoryTransactionSpecificData = specificData;
      if (!data.quantity || (data.quantity <= 0) || !data.costPerUnit || (data.costPerUnit <= 0)) {
        return false;
      }
    }
    if (type == InventoryTransactionType.Decrement) {
      const data: IDecrementInventoryTransactionSpecificData = specificData;
      if (!data.quantity || (data.quantity <= 0)) {
        return false;
      }
    }
    return true;
  }
}

interface ITransactionTypeOption {
  type: InventoryTransactionType,
  description: string
}

interface INewInventoryTransactionFormData {
  inventoryItem: IInventoryItem;
  description: string;
  effectiveDate: Date;
  debitAccountId: string;
  creditAccountId: string;
}
