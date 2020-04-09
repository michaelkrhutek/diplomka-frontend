import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitService } from 'src/app/services/financial-unit.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { StockDecrementType } from 'src/app/models/stock';
import { INewFinancialUnitData } from 'src/app/models/financial-unit';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-new-financial-unit-modal',
  templateUrl: './new-financial-unit-modal.component.html',
  styleUrls: ['./new-financial-unit-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFinancialUnitModalComponent {

  constructor(
    private financialUnitService: FinancialUnitService,
    private stockService: StockService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  
  financialUnitFG: FormGroup = new FormGroup({
    name: new FormControl(null),
    createDefaultData: new FormControl(false),
    stockDecrementType: new FormControl(null)
  });
  financialUnitFormData$: Observable<INewFinancialUnitData> = this.financialUnitFG.valueChanges.pipe(
    startWith(this.financialUnitFG.value)
  )

  createDefaultData$: Observable<boolean> = this.financialUnitFG.controls['createDefaultData'].valueChanges.pipe(
    startWith(this.financialUnitFG.controls['createDefaultData'].value)
  );

  stockDecrementTypeOptions: IStockDecrementTypeOption[] = this.stockService.getAllStockDecrementType()
  .map(type => {
    return {
      type,
      description: this.stockService.getStockDecrementTypeDescription(type)
    }
  });

  isCreateButtonDisabled$: Observable<boolean> = this.financialUnitFormData$.pipe(
    map((formData: INewFinancialUnitData) => {
      if (!formData.name) {
        return true;
      } 
      if (formData.createDefaultData && !formData.stockDecrementType) {
        return true;
      }
      return false;
    })
  );

  createFinancialUnit(): void {
    const data: INewFinancialUnitData = this.financialUnitFG.value;
    this.financialUnitService.createFinancialUnit(data);
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