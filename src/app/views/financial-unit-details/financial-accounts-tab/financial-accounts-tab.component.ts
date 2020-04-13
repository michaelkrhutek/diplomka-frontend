import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, tap, switchMap } from 'rxjs/operators';
import { FinancialAccount, IFinancialAccount, INewFinancialAccountData } from 'src/app/models/financial-account';
import { FormControl, FormGroup } from '@angular/forms';
import { BasicTable, IBasicTableHeaderInputData, BasicTableActionItemsPosition, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';
import { FinancialAccountService } from 'src/app/services/financial-account.service';
import { FinancialAccountType } from 'src/app/models/financial-account-type';
import { IFinancialAccountFilteringCriteria } from 'src/app/models/financial-account-filtering-criteria';

@Component({
  selector: 'app-financial-accounts-tab',
  templateUrl: './financial-accounts-tab.component.html',
  styleUrls: ['./financial-accounts-tab.component.css', '../financial-unit-details-tabs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialAccountsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private financialAccountService: FinancialAccountService,
    private popUpsService: PopUpsService
  ) { }

  isLoadingData: boolean = true;
  updateFinancialAccountModalData: INewFinancialAccountData = null;

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  accountTypeFC: FormControl = new FormControl(0);
  accountType$: Observable<FinancialAccountType> = this.accountTypeFC.valueChanges.pipe(
    startWith(this.accountTypeFC.value)
  );
  accountTypeOptions: IAccountTypeOption[] = this.financialAccountService.getAllInventoryTransactionTypes()
  .map(type => {
    return {
      type,
      description: this.financialAccountService.getFinancialAccountTypeDescription(type)
    };
  });

  filteringCriteriaFG: FormGroup = new FormGroup({
    filterText: new FormControl(''),
    type: new FormControl(0)
  });
  filteringCriteria$: Observable<IFinancialAccountFilteringCriteria> = this.filteringCriteriaFG.valueChanges.pipe(
    startWith(this.filteringCriteriaFG.value)
  );

  financialAccounts$: Observable<FinancialAccount[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.financialUnitDetailsService.reloadFinancialAccounts$
  ).pipe(
    tap(() => this.isLoadingData = true),
    switchMap(([financialUnitId]) => this.financialAccountService.getFinancialAccounts$(financialUnitId))
  );

  filtredFinancialAccounts$: Observable<IFinancialAccount[]> = combineLatest(
    this.financialAccounts$, this.filteringCriteria$
  ).pipe(
    map(([accounts, filteringCriteria]) => this.getFilteredFinancialAccounts(accounts, filteringCriteria))
  )

  tableData$: Observable<BasicTable> = this.filtredFinancialAccounts$.pipe(
    map((accounts: FinancialAccount[]) => this.getTableDataFromFinancialAccounts(accounts)),
    tap(() => (this.isLoadingData = false))
  );

  private getTableDataFromFinancialAccounts(
    accounts: IFinancialAccount[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 2,
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
        },
        {
          name: 'Typ účtu',
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
          iconName: 'create',
          description: 'Upravit',
          action: () => this.openNewFinancialAccountModal(account)
        },
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteAccount(account)
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
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.financialAccountService.getFinancialAccountTypeDescription(account.type)
        }
      ]
    }
    return row;
  }

  deleteAccount(account: IFinancialAccount): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním účtu se i smažou všechny jeho transakce a účetní zápisy. Opravdu chcete smazat účet?',
      action: () => this.financialUnitDetailsService.deleteFinancialAccount(account._id)
    };
    this.popUpsService.openConfirmationModal(data);
  }

  deleteAllAccounts(): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním všech účtů se i smažou všechny transakce a účetní zápisy. Opravdu chcete smazat všechny účty?',
      action: () => this.financialUnitDetailsService.deleteAllFinancialAccounts()
    };
    this.popUpsService.openConfirmationModal(data);
  }

  openNewFinancialAccountModal(financialAccount?: IFinancialAccount): void {
    if (financialAccount) {
      const data: INewFinancialAccountData = {
        _id: financialAccount._id,
        code: financialAccount.code,
        name: financialAccount.name,
        type: financialAccount.type
      };
      this.updateFinancialAccountModalData = data;
    } else {
      const data: INewFinancialAccountData = { _id: null, code: null, name: null, type: null };
      this.updateFinancialAccountModalData = data;
    }
  }

  closeNewFinancialAccountModal(): void {
    this.updateFinancialAccountModalData = null;
  }

  private getFilteredFinancialAccounts(
    accounts: FinancialAccount[],
    filteringCriteria: IFinancialAccountFilteringCriteria
  ): FinancialAccount[] {
    return accounts.filter((account) => {
      if (filteringCriteria.type && filteringCriteria.type != account.type) {
        return false;
      }
      if (!filteringCriteria.filterText) {
        return true;
      }
      return account.name.toLowerCase().includes(filteringCriteria.filterText.toLowerCase()) ||
        account.code.toLowerCase().includes(filteringCriteria.filterText.toLowerCase());
    });
  }
}



interface IAccountTypeOption {
  type: FinancialAccountType,
  description: string
}