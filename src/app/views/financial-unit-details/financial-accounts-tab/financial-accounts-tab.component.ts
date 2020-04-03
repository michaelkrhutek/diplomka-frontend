import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable, combineLatest } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map, startWith, tap } from 'rxjs/operators';
import { FinancialAccountService } from 'src/app/services/financial-account.service';
import { FinancialAccount } from 'src/app/models/financial-account';
import { FormControl } from '@angular/forms';

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

  openNewFinancialAccountModalIconItem: IIconItem = {
    description: 'Nový finanční účet',
    iconName: 'add',
    action: () => this.openNewFinancialAccountModal()
  };

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  listItems$: Observable<ListItem[]> = combineLatest(
    this.financialUnitDetailsService.financialAccounts$,
    this.filterText$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    map(([accounts, filterText]) => this.getFilteredFinancialAccounts(accounts, filterText)),
    map((accounts: FinancialAccount[]) => accounts.map(account => this.getListItemFromFinancialAccount(account))),
    tap(() => (this.isLoadingData = false)),
  );

  private getListItemFromFinancialAccount(account: FinancialAccount): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'Kód účtu', value: account.code, width: 8 },
        { label: 'Název účtu', value: account.name, width: 16 }
      ]
    };
    return new ListItem(data);
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
