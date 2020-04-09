import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { IInventoryTransactionPopulated } from 'src/app/models/inventory-transaction';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';
import { IStockBatch, IStock } from 'src/app/models/stock';
import { FormatterService } from 'src/app/services/formatter.service';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-inventory-transaction-details-modal',
  templateUrl: './inventory-transaction-details-modal.component.html',
  styleUrls: ['./inventory-transaction-details-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTransactionDetailsModalComponent implements OnInit {

  constructor(
    private inventoryTransactionService: InventoryTransactionService,
    private stockService: StockService,
    private formatterService: FormatterService
  ) { }

  @Input() transaction: IInventoryTransactionPopulated<any>;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  stockBeforeTransactionTableData: BasicTable = null;
  transactionTableData: BasicTable = null;
  stockAfterTransactionTableData: BasicTable = null;

  ngOnInit() {
    this.stockBeforeTransactionTableData = this.stockService.getTableDataFromStock(this.transaction.stockBeforeTransaction);
    this.transactionTableData = this.getTableDataFromTransaction(this.transaction);
    this.stockAfterTransactionTableData = this.stockService.getTableDataFromStock(this.transaction.stockAfterTransaction);
  }

  closeModal(): void {
    this.close.emit();
  }

  private getTableDataFromTransaction(
    transaction: IInventoryTransactionPopulated<any>
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      otherCells: [
        {
          name: 'Druh transakce',
          width: 8,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Množství',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Hodnota na jednotku',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Celková hodnota',
          width: 6,
          align: BasicTableValueAlign.Right
        }
      ]
    };
    const row: IBasicTableRowInputData = this.getTableRowDataFromInventoryTransaction(transaction)
    const data: IBasicTableInputData = { header, rows: [row] };
    return new BasicTable(data);
  }

  private getTableRowDataFromInventoryTransaction(
    transaction: IInventoryTransactionPopulated<any>
  ): IBasicTableRowInputData {
    const costPerUnit: number = transaction.totalTransactionAmount / (transaction.specificData['quantity'] as number);
    const row: IBasicTableRowInputData = {
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: this.inventoryTransactionService.getTransactionTypeDescription(transaction.type)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(transaction.specificData['quantity'] as number)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(costPerUnit, 2)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(transaction.totalTransactionAmount, 2)
        }
      ]
    }
    return row;
  }
}
