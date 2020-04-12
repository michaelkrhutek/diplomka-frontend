import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InventoryTransactionTemplateService } from 'src/app/services/inventory-transaction-template.service';
import { Observable, of, combineLatest } from 'rxjs';
import { IInventoryTransactionTemplatePopulated } from 'src/app/models/inventory-transaction-template';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { switchMap, startWith, map, tap } from 'rxjs/operators';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { FormControl } from '@angular/forms';
import { BasicTable, IBasicTableHeaderInputData, BasicTableActionItemsPosition, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';
import { PaginatedTable } from 'src/app/models/paginated-table-models';
import { IInventoryTransactionPopulated } from 'src/app/models/inventory-transaction';
import { IInventoryTransactionFilteringCriteria } from 'src/app/models/inventory-transaction-filtering-criteria';

@Component({
  selector: 'app-inventory-transaction-template',
  templateUrl: './inventory-transaction-template.component.html',
  styleUrls: ['./inventory-transaction-template.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTransactionTemplateComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private inventoryTransactionTemplateService: InventoryTransactionTemplateService,
    private inventoryTransactionService: InventoryTransactionService,
    private popUpsService: PopUpsService
  ) { }

  isLoadingData: boolean = true;
  isNewTransactionTemplateModalOpened: boolean = false;

  filterTextFC: FormControl = new FormControl(null);
  filterText$: Observable<string> = this.filterTextFC.valueChanges.pipe(
    startWith(this.filterTextFC.value),
    map((filterText: string) => filterText || '')
  );

  transactionTemplates$: Observable<IInventoryTransactionTemplatePopulated[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.financialUnitDetailsService.reloadTransactionTemplates$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(([financialUnitId]) => {
      return financialUnitId ? this.inventoryTransactionTemplateService.getAllInventoryTransactionTemplates$(financialUnitId) : of([]);
    })
  );

  tableData$: Observable<BasicTable> = combineLatest(
    this.transactionTemplates$,
    this.filterText$
  ).pipe(
    map(([templates, filterText]) => this.getFilteredTemplates(templates, filterText)),
    map((items: IInventoryTransactionTemplatePopulated[]) => this.getTableDataFromInventoryItems(items)),
    tap(() => (this.isLoadingData = false)),
  );

  private getTableDataFromInventoryItems(
    templates: IInventoryTransactionTemplatePopulated[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      actionItemsContainerWidth: 1,
      otherCells: [
        {
          name: 'Skupina zásob',
          width: 8,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Typ transakce',
          width: 8,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Popisek',
          width: 12,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Debetní účet',
          width: 16,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Kreditní účet',
          width: 16,
          align: BasicTableValueAlign.Left
        },
      ]
    };
    const rows: IBasicTableRowInputData[] = (templates || [])
      .map(template => this.getTableRowDataFromInventoryItem(template));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryItem(
    template: IInventoryTransactionTemplatePopulated
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: [
        {
          iconName: 'delete',
          description: 'Smazat',
          action: () => this.deleteTemplate(template)
        }
      ],
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: template.inventoryGroup.name
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.inventoryTransactionService.getTransactionTypeDescription(template.transactionType)
        },
        {
          type: BasicTableRowCellType.Display,
          data: template.description
        },
        {
          type: BasicTableRowCellType.Display,
          data: template.debitAccount.code + ' - ' + template.debitAccount.name 
        },
        {
          type: BasicTableRowCellType.Display,
          data: template.creditAccount.code + ' - ' + template.creditAccount.name 
        }
      ]
    }
    return row;
  }

  openNewTransactionTemplateModal(): void {
    this.isNewTransactionTemplateModalOpened = true;
  }

  closeNewTransactionTemplateModal(): void {
    this.isNewTransactionTemplateModalOpened = false;
  }

  deleteTemplate(template: IInventoryTransactionTemplatePopulated): void {
    const data: IConfirmationModalData = {
      message: 'Opravdu chcete smazat šablonu?',
      action: () => this.financialUnitDetailsService.deleteTransactionTemplate(template._id)
    };
    this.popUpsService.openConfirmationModal(data);
  }

  deleteAllTemplates(): void {
    const data: IConfirmationModalData = {
      message: 'Opravdu chcete smazat všechny šablony?',
      action: () => this.financialUnitDetailsService.deleteAllTransactionTemplates()
    };
    this.popUpsService.openConfirmationModal(data);
  }

  private getFilteredTemplates(
    templates: IInventoryTransactionTemplatePopulated[],
    filterText: string
  ): IInventoryTransactionTemplatePopulated[] {
    return templates.filter((template) => template.description.toLowerCase().includes(filterText.toLowerCase()));
  }
}
