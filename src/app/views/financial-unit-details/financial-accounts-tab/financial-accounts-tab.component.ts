import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, startWith, tap } from 'rxjs/operators';
import { FinancialAccountService } from 'src/app/services/financial-account.service';
import { FinancialAccount, IFinancialAccount } from 'src/app/models/financial-account';
import { FormControl } from '@angular/forms';
import { BasicTable, IBasicTableHeaderInputData, BasicTableActionItemsPosition, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';

@Component({
  selector: 'app-financial-accounts-tab',
  templateUrl: './financial-accounts-tab.component.html',
  styleUrls: ['./financial-accounts-tab.component.css', '../financial-unit-details-tabs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialAccountsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private financialAccountService: FinancialAccountService
  ) { }

  isLoadingData: boolean = true;
  isNewFinancialAccountModalOpened: boolean = false;

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  tableData$: Observable<BasicTable> = combineLatest(
    this.financialUnitDetailsService.financialAccounts$,
    this.filterText$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    map(([accounts, filterText]) => this.getFilteredFinancialAccounts(accounts, filterText)),
    map((accounts: FinancialAccount[]) => this.getTableDataFromFinancialAccounts(accounts)),
    tap(() => (this.isLoadingData = false)),
  );

  private getTableDataFromFinancialAccounts(
    accounts: IFinancialAccount[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 1,
      otherCells: [
        {
          name: 'Kód účtu',
          width: 6,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Název účtu',
          width: 16,
          align: BasicTableValueAlign.Left
        }
      ]
    };
    const rows: IBasicTableRowInputData[] = (accounts || [])
      .map(account => this.getTableRowDataFromFinancialAccount(account));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromFinancialAccount(
    account: IFinancialAccount
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteAccount()
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: account.code
        },
        {
          type: BasicTableRowCellType.Display,
          data: account.name
        }
      ]
    }
    return row;
  }

  deleteAccount(): void {
    // TODO
  }

  deleteAllAccounts(): void {
    // TODO
  }

  openNewFinancialAccountModal(): void {
    this.isNewFinancialAccountModalOpened = true;
  }

  closeNewFinancialAccountModal(): void {
    this.isNewFinancialAccountModalOpened = false;
  }

  private getFilteredFinancialAccounts(
    accounts: FinancialAccount[],
    filterText: string
  ): FinancialAccount[] {
    return accounts.filter((account) => {
      return account.name.toLowerCase().includes(filterText.toLowerCase()) ||
        account.code.toLowerCase().includes(filterText.toLowerCase());
    });
  }
}
