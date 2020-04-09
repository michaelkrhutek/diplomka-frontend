import { Component, ChangeDetectionStrategy } from '@angular/core';
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
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';
import { PaginatedTable } from 'src/app/models/paginated-table-models';

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

  isLoadingData: boolean = true;

  financialAccounts$: Observable<IFinancialAccount[]> = this.financialUnitDetailsService.financialAccounts$;

  filteringCriteriaFG: FormGroup = new FormGroup({
    accountId: new FormControl(0),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null)
  });

  private filteringCriteria$: Observable<IFinancialTransactionsFilteringCriteria> = this.filteringCriteriaFG.valueChanges.pipe(
    startWith(this.filteringCriteriaFG.value),
    debounceTime(100)
  );

  // financialTransactions$: Observable<FinancialTransactionPopulated[]> = combineLatest(
  //   this.financialUnitDetailsService.financialUnitId$,
  //   this.filteringCriteria$,
  //   this.financialUnitDetailsService.reloadTransactions$
  // ).pipe(
  //   tap(() => (this.isLoadingData = true)),
  //   switchMap(([financialUnitId, filteringCriteria]) => {
  //     return this.financialTransactionService.getFiltredFinancialTransactions$(financialUnitId, filteringCriteria);
  //   }),
  // );

  // tableData$: Observable<BasicTable> = this.financialTransactions$.pipe(
  //   map((transactions: FinancialTransactionPopulated[]) => this.getTableDataFromFinancialTransactions(transactions)),
  //   tap(() => (this.isLoadingData = false))
  // );

  paginatedTable = new PaginatedTable<FinancialTransactionPopulated, IFinancialTransactionsFilteringCriteria>(
    this.filteringCriteria$,
    (fc, pi, ps) => {
      const financialUnitId: string = this.financialUnitDetailsService.getFinancialUnitId();
      return this.financialTransactionService.getFiltredPaginatedFinancialTransactions$(financialUnitId, fc, pi, ps)
    },
    (rs) => this.getTableDataFromFinancialTransactions(rs),
    (fc) => {
      const financialUnitId: string = this.financialUnitDetailsService.getFinancialUnitId();
      return this.financialTransactionService.getFiltredFinancialTransactionsCount$(financialUnitId, fc)
    },    
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

  private getTableDataFromFinancialTransactions(
    transactions: FinancialTransactionPopulated[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      stickyCells: [

        {
          name: 'ID zápisu',
          width: 6,
          align: BasicTableValueAlign.Left
        }
      ],
      otherCells: [
        {
          name: 'ID transakce',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Datum transakce',
          width: 8,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Kód debetního účtu',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Název debetního účtu',
          width: 10,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Kód debetního účtu',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Název debetního účtu',
          width: 10,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Částka',
          width: 6,
          align: BasicTableValueAlign.Right
        }
      ]
    };
    const rows: IBasicTableRowInputData[] = (transactions || [])
      .map(t => this.getTableRowDataFromFinancialTransaction(t));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromFinancialTransaction(
    transaction: FinancialTransactionPopulated
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      stickyCells: [
        {
          type: BasicTableRowCellType.Display,
          data: transaction._id
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: transaction.inventoryTransaction
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getDayMonthYearString(transaction.effectiveDate)
        },
        {
          type: BasicTableRowCellType.Display,
          data: transaction.debitAccount.code
        },
        {
          type: BasicTableRowCellType.Display,
          data:transaction.debitAccount.name
        },
        {
          type: BasicTableRowCellType.Display,
          data: transaction.creditAccount.code
        },
        {
          type: BasicTableRowCellType.Display,
          data: transaction.creditAccount.name
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(transaction.amount, 2)
        }
      ]
    }
    return row;
  }
}
