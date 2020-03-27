import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { StockDecrementType } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-new-inventory-items-group-modal',
  templateUrl: './new-inventory-items-group-modal.component.html',
  styleUrls: ['./new-inventory-items-group-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInventoryItemsGroupModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private stockService: StockService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  nameFC: FormControl = new FormControl(null);

  stockDecrementTypeOptions: IStockDecrementTypeOption[] = this.stockService.getAllStockDecrementType()
    .map(type => {
      return {
        type,
        description: this.stockService.getStockDecrementTypeDescription(type)
      }
    });
  defaultStockDecrementTypeFC: FormControl = new FormControl(
    this.stockDecrementTypeOptions.length > 0 ? this.stockDecrementTypeOptions[0].type : null
  );

  newInventoryGroupFG: FormGroup = new FormGroup({
    name: this.nameFC,
    defaultStockDecrementType: this.defaultStockDecrementTypeFC
  });

  isCreateButtonDisabled$: Observable<boolean> = this.newInventoryGroupFG.valueChanges.pipe(
    startWith(this.newInventoryGroupFG.value),
    map((formData: INewInventoryGroupFormData) => {
      return !formData.name || !formData.defaultStockDecrementType ? true : false;
    })
  );

  createInventoryItemsGroup(): void {
    const data: INewInventoryGroupFormData = this.newInventoryGroupFG.value;
    this.financialUnitDetailsService.createInventoryItemsGroup(data.name, data.defaultStockDecrementType);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}

interface IStockDecrementTypeOption {
  type: StockDecrementType,
  description: string
}

interface INewInventoryGroupFormData {
  name: string;
  defaultStockDecrementType: StockDecrementType
}