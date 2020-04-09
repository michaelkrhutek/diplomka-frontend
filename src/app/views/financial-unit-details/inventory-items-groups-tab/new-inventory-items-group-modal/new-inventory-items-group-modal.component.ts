import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { StockDecrementType } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';
import { INewInventoryGroupData } from 'src/app/models/inventory-items-group';

@Component({
  selector: 'app-new-inventory-items-group-modal',
  templateUrl: './new-inventory-items-group-modal.component.html',
  styleUrls: ['./new-inventory-items-group-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInventoryItemsGroupModalComponent implements OnInit {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private stockService: StockService
  ) { }

  @Input() data: INewInventoryGroupData;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  headingText: string;
  buttonText: string;

  ngOnInit(): void {
    if (this.data._id) {
      this.headingText = 'Úprava skupiny zásob'
      this.buttonText = 'Uložit';
      this.inventoryGroupFG.patchValue(this.data);
    } else {
      this.headingText = 'Nová skupina zásob'
      this.buttonText = 'Vytvořit';
    }
  }

  stockDecrementTypeOptions: IStockDecrementTypeOption[] = this.stockService.getAllStockDecrementType()
    .map(type => {
      return {
        type,
        description: this.stockService.getStockDecrementTypeDescription(type)
      }
    });

  inventoryGroupFG: FormGroup = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl(null),
    defaultStockDecrementType: new FormControl(null)
  });

  isCreateButtonDisabled$: Observable<boolean> = this.inventoryGroupFG.valueChanges.pipe(
    startWith(this.inventoryGroupFG.value),
    map((formData: INewInventoryGroupData) => {
      return !formData.name || !formData.defaultStockDecrementType ? true : false;
    })
  );

  createInventoryItemsGroup(): void {
    const data: INewInventoryGroupData = this.inventoryGroupFG.value;
    if (data._id) {
      this.financialUnitDetailsService.updateInventoryItemsGroup(data);
    } else {
      this.financialUnitDetailsService.createInventoryItemsGroup(data);
    }
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