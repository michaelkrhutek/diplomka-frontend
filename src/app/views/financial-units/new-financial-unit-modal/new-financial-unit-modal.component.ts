import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitService } from 'src/app/services/financial-unit.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-new-financial-unit-modal',
  templateUrl: './new-financial-unit-modal.component.html',
  styleUrls: ['./new-financial-unit-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFinancialUnitModalComponent {

  constructor(
    private financialUnitService: FinancialUnitService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  nameFC: FormControl = new FormControl(null);
  
  isCreateButtonDisabled$: Observable<boolean> = this.nameFC.valueChanges.pipe(
    startWith(this.nameFC.value),
    map((name: string) => !name)
  );

  createFinancialUnit(): void {
    const name: string = this.nameFC.value;
    this.financialUnitService.createFinancialUnit(name);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}
