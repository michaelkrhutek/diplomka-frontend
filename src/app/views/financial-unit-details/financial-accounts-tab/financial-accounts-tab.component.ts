import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IIconItem } from 'src/app/models/icon-item';
import { Observable } from 'rxjs';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map } from 'rxjs/operators';
import { FinancialAccountService } from 'src/app/services/financial-account.service';
import { FinancialAccount } from 'src/app/models/financial-account';

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

  isNewFinancialAccountModalOpened: boolean = false;

  openNewFinancialAccountModalIconItem: IIconItem = {
    description: 'Nový finanční účet',
    iconName: 'add',
    action: () => this.openNewFinancialAccountModal()
  };

  listItems$: Observable<ListItem[]> = this.financialUnitDetailsService.financialAccounts$.pipe(
    map((accounts: FinancialAccount[]) => accounts.map(account => this.getListItemFromFinancialAccount(account)))
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
}
