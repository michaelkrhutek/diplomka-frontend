import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TrialBalanceService } from 'src/app/services/trial-balance.service';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { Observable, of, combineLatest } from 'rxjs';
import { tap, switchMap, map, startWith, combineAll, take } from 'rxjs/operators';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { TrialBalance, ITrialBalanceAccount } from 'src/app/models/trial-balance';
import { FormControl } from '@angular/forms';
import { IFinancialPeriod } from 'src/app/models/financial-period';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, BasicTableRowCellType, IBasicTableInputData } from 'src/app/models/basic-table-models';

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

  tableData$: Observable<BasicTable> = this.trialBalance$.pipe(
    map((trialBalance) => trialBalance ? this.getTableDataFromTrialBalance(trialBalance) : null),
    tap(() => (this.isLoadingData = false))
  );

  ngOnInit(): void {
    this.financialUnitDetailsService.financialPeriods$.pipe(
      map((periods: IFinancialPeriod[]) => {
        const lastPeriod: IFinancialPeriod = periods.length > 0 ? periods[periods.length - 1] : null;
        return lastPeriod ? lastPeriod._id : null;
      }),
      take(1)
    ).subscribe((periodId: string) => setTimeout(() => this.financialPeriodIdFC.patchValue(periodId)));
  }

  private getTableDataFromTrialBalance(
    trialBalance: TrialBalance
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      otherCells: [
        {
          name: 'Kód účtu',
          width: 8,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Název účtu',
          width: 12,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Debetní zápisy',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Debetní obrat',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Kreditní zápisy',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Kreditní obrat',
          width: 6,
          align: BasicTableValueAlign.Right
        },
      ]
    };
    const rows: IBasicTableRowInputData[] = (trialBalance.accounts || [])
      .map(account => this.getTableRowDataFromTrialBalanceAccount(account));
    const totalRow: IBasicTableRowInputData = {
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: 'Celkem'
        },
        {
          type: BasicTableRowCellType.Display,
          data: ''
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(trialBalance.totalDebitEntries)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(trialBalance.totalDebitAmount, 2)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(trialBalance.totalCreditEntries)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(trialBalance.totalCreditAmount, 2)
        }
      ]
    };
    const data: IBasicTableInputData = { header, rows: [...rows, totalRow] };
    return new BasicTable(data);
  }

  private getTableRowDataFromTrialBalanceAccount(
    account: ITrialBalanceAccount
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: account.account.code
        },
        {
          type: BasicTableRowCellType.Display,
          data: account.account.name
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(account.debitEntriesCount)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(account.debitAmount, 2)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(account.creditEntriesCount)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(account.creditAmount, 2)
        }
      ]
    }
    return row;
  }
}

interface IFinancialPeriodOption {
  id: string;
  description: string;
};