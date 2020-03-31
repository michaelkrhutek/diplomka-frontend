import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TrialBalanceService } from 'src/app/services/trial-balance.service';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { Observable, of, combineLatest } from 'rxjs';
import { tap, switchMap, map, startWith, combineAll } from 'rxjs/operators';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { TrialBalance, ITrialBalanceAccount } from 'src/app/models/trial-balance';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-trial-balance-tab',
  templateUrl: './trial-balance-tab.component.html',
  styleUrls: ['./trial-balance-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrialBalanceTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private trialBalanceService: TrialBalanceService,
    private formatterService: FormatterService
  ) { }

  isLoadingData: boolean = false;

  financialPeriodOptions$: Observable<IFinancialPeriodOption[]> = combineLatest(
    this.financialUnitDetailsService.financialPeriods$,
    this.financialUnitDetailsService.reloadTransactions$
  ).pipe(
    map(([financialPeriods]) => {
      return financialPeriods.map((period) => {
        return {
          id: period._id,
          description: `${this.formatterService.getDayMonthYearString(period.startDate)} - ${this.formatterService.getDayMonthYearString(period.endDate)}`
        };
      })
    }),
  );
  financialPeriodIdFC: FormControl = new FormControl(null);
  selectedFinancialPeriodId$: Observable<string> = this.financialPeriodIdFC.valueChanges.pipe(
    startWith(this.financialPeriodIdFC.value)
  );

  trialBalance$: Observable<TrialBalance> = this.selectedFinancialPeriodId$.pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap((financialPeriodId) => financialPeriodId ? this.trialBalanceService.getFinancialPeriodTrialBalance$(financialPeriodId) : of(null)),
  );

  listItems$: Observable<ListItem[]> = this.trialBalance$.pipe(
    map((trialBalance: TrialBalance) => {
      if (!trialBalance) {
        return [];
      } 
      return [
        this.getListItemFromTotalValues(trialBalance),
        ...trialBalance.accounts.map((acc) => this.getListItemFromTrialBalanceAccount(acc))
      ];
    }),
    tap(() => (this.isLoadingData = false)),
  );

  private getListItemFromTrialBalanceAccount(account: ITrialBalanceAccount): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'Kód účtu', value: account.account.code, width: 6 },
        { label: 'Název účtu', value: account.account.name, width: 12 },
        { label: 'Počet debetních zápisů', value: this.formatterService.getRoundedNumberString(account.debitEntriesCount), width: 8 },
        { label: 'Debetní obrat', value: this.formatterService.getRoundedNumberString(account.debitAmount, 2), width: 8 },
        { label: 'Počet kreditních zápisů', value: this.formatterService.getRoundedNumberString(account.creditEntriesCount), width: 8 },
        { label: 'Kreditní obrat', value: this.formatterService.getRoundedNumberString(account.creditAmount, 2), width: 8 }
      ]
    };
    return new ListItem(data);
  }

  private getListItemFromTotalValues(trialBalance: TrialBalance): ListItem {
    const data: IListItem = {
      textItems: [
        { label: '', value: 'Celkem', width: 6 },
        { label: '', value: '', width: 12 },
        { label: 'Počet debetních zápisů', value: this.formatterService.getRoundedNumberString(trialBalance.totalDebitEntries), width: 8 },
        { label: 'Debetní obrat', value: this.formatterService.getRoundedNumberString(trialBalance.totalDebitAmount, 2), width: 8 },
        { label: 'Počet kreditních zápisů', value: this.formatterService.getRoundedNumberString(trialBalance.totalCreditEntries), width: 8 },
        { label: 'Kreditní obrat', value: this.formatterService.getRoundedNumberString(trialBalance.totalCreditAmount, 2), width: 8 }
      ]
    };
    return new ListItem(data);
  }
}

interface IFinancialPeriodOption {
  id: string;
  description: string;
};