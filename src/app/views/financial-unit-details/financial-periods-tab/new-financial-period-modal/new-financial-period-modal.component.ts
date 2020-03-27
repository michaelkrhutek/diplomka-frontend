import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, take, filter } from 'rxjs/operators';
import { IFinancialPeriod } from 'src/app/models/financial-period';

@Component({
  selector: 'app-new-financial-period-modal',
  templateUrl: './new-financial-period-modal.component.html',
  styleUrls: ['./new-financial-period-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFinancialPeriodModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  startDateFC: FormControl = new FormControl(null);
  selectedStartDate$: Observable<Date> = this.startDateFC.valueChanges.pipe(
    startWith(this.startDateFC)
  );

  endDateFC: FormControl = new FormControl(null);
  selectedEndDate$: Observable<Date> = this.endDateFC.valueChanges.pipe(
    startWith(this.endDateFC)
  );

  financialPeriodDatesFG: FormGroup = new FormGroup({
    startDate: this.startDateFC,
    endDate: this.endDateFC
  });

  maximalStartDate$: Observable<Date> = this.selectedEndDate$.pipe(
    map((endDate: Date) => endDate || null)
  );

  minimalEndDate$: Observable<Date> = this.selectedStartDate$.pipe(
    map((startDate: Date) => startDate || null)
  );

  canBeStartDateSelected: boolean = true;

  lastFinancialPeriodStartDate$: Observable<Date> = this.financialUnitDetailsService.financialPeriods$.pipe(
    map((financialPeriods: IFinancialPeriod[]) => {
      const lastFinancialPeriod: IFinancialPeriod = financialPeriods.length > 0 ? financialPeriods[financialPeriods.length - 1] : null;
      console.log(lastFinancialPeriod);
      if (lastFinancialPeriod) {
        const lastFinancialPeriodEndDate: Date = lastFinancialPeriod.endDate;
        const startDate: Date = new Date(lastFinancialPeriodEndDate);
        startDate.setDate(startDate.getDate() + 1);
        return startDate;
      }
      return null;
    })
  );

  isCreateButtonDisabled$: Observable<boolean> = this.financialPeriodDatesFG.valueChanges.pipe(
    startWith(this.financialPeriodDatesFG.value),
    map((financialPeriodDates: IFinancialPeriodDates) => !financialPeriodDates.startDate || !financialPeriodDates.endDate)
  );

  ngOnInit(): void {
    this.lastFinancialPeriodStartDate$.pipe(
      take(1),
      filter((startDate: Date | null) => !!startDate),
    ).subscribe((startDate: Date) => {
      setTimeout(() => {
        this.startDateFC.patchValue(startDate);
        this.canBeStartDateSelected = false;
      })
    });
  }

  createFinancialPeriod(): void {
    const startDate: Date = this.startDateFC.value;
    const endDate: Date = this.endDateFC.value;
    this.financialUnitDetailsService.createFinancialPeriod(startDate, endDate);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}

interface IFinancialPeriodDates {
  startDate: Date;
  endDate: Date;
}
