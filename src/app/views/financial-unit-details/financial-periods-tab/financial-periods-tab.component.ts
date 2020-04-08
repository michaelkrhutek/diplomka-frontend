import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable } from 'rxjs';
import { IFinancialPeriod } from 'src/app/models/financial-period';
import { map, tap } from 'rxjs/operators';
import { FormatterService } from 'src/app/services/formatter.service';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType, BasicTableActionItemsPosition } from 'src/app/models/basic-table-models';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';

@Component({
  selector: 'app-financial-periods-tab',
  templateUrl: './financial-periods-tab.component.html',
  styleUrls: ['./financial-periods-tab.component.css', '../financial-unit-details-tabs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialPeriodsTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private formatterService: FormatterService,
    private popUpsService: PopUpsService
  ) { }

  isNewFinancialPeriodModalOpened: boolean = false;
  isLoadingData: boolean = true;

  tableData$: Observable<BasicTable> = this.financialUnitDetailsService.financialPeriods$.pipe(
    map((financialPeriods: IFinancialPeriod[]) => this.getTableDataFromInventoryPeriods(financialPeriods)),
    tap(() => (this.isLoadingData = false))
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
      .map((period, i, a) => this.getTableRowDataFromInventoryPeriod(period, i == a.length - 1));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryPeriod(
    period: IFinancialPeriod,
    isLast: boolean
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: isLast ? [
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteLastPeriod()
        }
      ] : [],
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

  deleteLastPeriod(): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním období se i smažou všechny jeho transakce a účetní zápisy. Opravdu chcete smazat období?',
      action: () => this.financialUnitDetailsService.deleteLastFinancialPeriod()
    };
    this.popUpsService.openConfirmationModal(data);
  }

  deleteAllPeriods(): void {
    const data: IConfirmationModalData = {
      message: 'Smazáním všech období se i smažou všechny transakce a účetní zápisy. Opravdu chcete smazat všechna období?',
      action: () => this.financialUnitDetailsService.deleteAllFinancialPeriods()
    };
    this.popUpsService.openConfirmationModal(data);
  }

  openNewFinancialPeriodModal(): void {
    this.isNewFinancialPeriodModalOpened = true;
  }

  closeNewFinancialPeriodModal(): void {
    this.isNewFinancialPeriodModalOpened = false;
  }
}
