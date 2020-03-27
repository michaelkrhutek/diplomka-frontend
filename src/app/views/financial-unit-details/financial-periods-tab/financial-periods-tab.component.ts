import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable } from 'rxjs';
import { IFinancialPeriod } from 'src/app/models/financial-period';
import { ListItem, IListItem } from 'src/app/models/list-item';
import { map } from 'rxjs/operators';
import { FormatterService } from 'src/app/services/formatter.service';
import { IIconItem } from 'src/app/models/icon-item';

@Component({
  selector: 'app-financial-periods-tab',
  templateUrl: './financial-periods-tab.component.html',
  styleUrls: ['./financial-periods-tab.component.css', '../financial-unit-details-tabs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialPeriodsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private formatterService: FormatterService
  ) { }

  isNewFinancialPeriodModalOpened: boolean = false;

  openNewFinancialPeriodModalIconItem: IIconItem = {
    description: 'Nové účetní období',
    iconName: 'add',
    action: () => this.openNewFinancialPeriodModal()
  };

  listItems$: Observable<ListItem[]> = this.financialUnitDetailsService.financialPeriods$.pipe(
    map((financialPeriods: IFinancialPeriod[]) => financialPeriods.map(financialPeriod => this.getListItemFromFinancialPeriod(financialPeriod)))
  );

  private getListItemFromFinancialPeriod(financialPeriod: IFinancialPeriod): ListItem {
    const data: IListItem = {
      textItems: [
        { label: 'Počateční datum', value: this.formatterService.getDayMonthYearString(financialPeriod.startDate), width: 8 },
        { label: 'Konenčné datum', value: this.formatterService.getDayMonthYearString(financialPeriod.endDate), width: 8 }
      ]
    };
    return new ListItem(data);
  }

  openNewFinancialPeriodModal(): void {
    this.isNewFinancialPeriodModalOpened = true;
  }

  closeNewFinancialPeriodModal(): void {
    this.isNewFinancialPeriodModalOpened = false;
  }
}
