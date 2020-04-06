import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable } from 'rxjs';
import { IFinancialPeriod } from 'src/app/models/financial-period';
import { map } from 'rxjs/operators';
import { FormatterService } from 'src/app/services/formatter.service';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType, BasicTableActionItemsPosition } from 'src/app/models/basic-table-models';

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

  tableData$: Observable<BasicTable> = this.financialUnitDetailsService.financialPeriods$.pipe(
    map((financialPeriods: IFinancialPeriod[]) => this.getTableDataFromInventoryPeriods(financialPeriods))
  );

  private getTableDataFromInventoryPeriods(
    periods: IFinancialPeriod[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 1,
      otherCells: [
        {
          name: 'Začátek období',
          width: 12,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Konec období',
          width: 10,
          align: BasicTableValueAlign.Left
        }
      ]
    };
    const rows: IBasicTableRowInputData[] = (periods || [])
      .map(period => this.getTableRowDataFromInventoryPeriod(period));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryPeriod(
    period: IFinancialPeriod
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deletePeriod(period)
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getDayMonthYearString(period.startDate)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getDayMonthYearString(period.endDate)
        }
      ]
    }
    return row;
  }

  deletePeriod(period: IFinancialPeriod): void {

  }

  deleteAllPeriods(): void {

  }

  openNewFinancialPeriodModal(): void {
    this.isNewFinancialPeriodModalOpened = true;
  }

  closeNewFinancialPeriodModal(): void {
    this.isNewFinancialPeriodModalOpened = false;
  }
}
