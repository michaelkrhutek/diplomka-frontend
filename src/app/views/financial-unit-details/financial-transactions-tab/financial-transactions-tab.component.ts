import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FinancialTransactionService } from 'src/app/services/financial-transaction.service';
import { FormatterService } from 'src/app/services/formatter.service';
import { Observable, combineLatest } from 'rxjs';
import { FinancialTransactionPopulated } from 'src/app/models/financial-transaction';
import { switchMap, tap, map, startWith, take, debounceTime } from 'rxjs/operators';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { FormGroup, FormControl } from '@angular/forms';
import { IFinancialTransactionsFilteringCriteria } from 'src/app/models/financial-transactions-filtering-criteria';
import { IFinancialAccount } from 'src/app/models/financial-account';

@Component({
  selector: 'app-financial-transactions-tab',
  templateUrl: './financial-transactions-tab.component.html',
  styleUrls: ['./financial-transactions-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialTransactionsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private financialTransactionService: FinancialTransactionService,
    private formatterService: FormatterService
  ) { }

  isLoadingData: boolean = false;

  financialAccounts$: Observable<IFinancialAccount[]> = this.financialUnitDetailsService.financialAccounts$;

  filteringCriteriaFG: FormGroup = new FormGroup({
    accountId: new FormControl(null),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null)
  });

  private filteringCriteria$: Observable<IFinancialTransactionsFilteringCriteria> = this.filteringCriteriaFG.valueChanges.pipe(
    startWith(this.filteringCriteriaFG.value),
    debounceTime(100)
  );

  financialTransactions$: Observable<FinancialTransactionPopulated[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.filteringCriteria$,
    this.financialUnitDetailsService.reloadTransactions$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(([financialUnitId, filteringCriteria]) => {
      return this.financialTransactionService.getFiltredFinancialTransactions$(financialUnitId, filteringCriteria);
    }),
  );

  listItems$: Observable<ListItem[]> = this.financialTransactions$.pipe(
    map((transactions: FinancialTransactionPopulated[]) => transactions.map(transaction => this.getListItemFromFinancialTransaction(transaction))),
    tap(() => (this.isLoadingData = false)),
  );

  ngOnInit(): void {
    combineLatest(
      this.financialUnitDetailsService.firstPeriodStartDate$,
      this.financialUnitDetailsService.lastPeriodEndDate$
    ).pipe(
      take(1)
    ).subscribe(([dateFrom, dateTo]) => {
      setTimeout(() => this.filteringCriteriaFG.patchValue({ dateFrom, dateTo }));
    })
  }

  private getListItemFromFinancialTransaction(transaction: FinancialTransactionPopulated): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'ID zápisu', value: transaction._id, width: 14 },
        { label: 'ID transakce', value: transaction.inventoryTransaction, width: 14 },
        { label: 'Datum', value: this.formatterService.getDayMonthYearString(transaction.effectiveDate), width: 8 },
        { label: 'Debitní účet', value: transaction.debitAccount.code, width: 6 },
        { label: 'Název debitního účtu', value: transaction.debitAccount.name, width: 10 },
        { label: 'Kreditní účet', value: transaction.creditAccount.code, width: 6 },
        { label: 'Název kreditního účtu', value: transaction.creditAccount.name, width: 10 },
        { label: 'Částka', value: this.formatterService.getRoundedNumberString(transaction.amount, 2), width: 8 }
      ]
    };
    return new ListItem(data);
  }
}
