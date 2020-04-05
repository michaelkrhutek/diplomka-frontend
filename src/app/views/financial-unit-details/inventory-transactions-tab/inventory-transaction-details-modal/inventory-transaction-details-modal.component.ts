import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { IInventoryTransactionPopulated } from 'src/app/models/inventory-transaction';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';
import { IStockBatch, IStock } from 'src/app/models/stock';
import { FormatterService } from 'src/app/services/formatter.service';
import { InventoryTransactionService } from 'src/app/services/inventory-transaction.service';

@Component({
  selector: 'app-inventory-transaction-details-modal',
  templateUrl: './inventory-transaction-details-modal.component.html',
  styleUrls: ['./inventory-transaction-details-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTransactionDetailsModalComponent implements OnInit {

  constructor(
    private inventoryTransactionService: InventoryTransactionService,
    private formatterService: FormatterService
  ) { }

  @Input() transaction: IInventoryTransactionPopulated<any>;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  stockBeforeTransactionTableData: BasicTable = null;
  transactionTableData: BasicTable = null;
  stockAfterTransactionTableData: BasicTable = null;

  ngOnInit() {
    this.stockBeforeTransactionTableData = this.getTableDataFromStock(this.transaction.stockBeforeTransaction);
    this.transactionTableData = this.getTableDataFromTransaction(this.transaction);
    this.stockAfterTransactionTableData = this.getTableDataFromStock(this.transaction.stockAfterTransaction);
    console.log(this.stockBeforeTransactionTableData);
  }

  closeModal(): void {
    this.close.emit();
  }

  private getTableDataFromStock(
    stock: IStock
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      otherCells: [
        {
          name: 'Datum dávky',
          width: 8,
          align: BasicTableValueAlign.Left
        },
        {
          name: 'Množství dávky',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Hodnota dávky na jednotku',
          width: 6,
          align: BasicTableValueAlign.Right
        },
        {
          name: 'Celková hodnota dávky',
          width: 6,
          align: BasicTableValueAlign.Right
        },
      ]
    };
    const rows: IBasicTableRowInputData[] = (stock.batches || [])
      .map(batch => this.getTableRowDataFromStockBatch(batch));
    const costPerUnit: number = stock.totalStockQuantity ? stock.totalStockCost / stock.totalStockQuantity : 0;
    const totalRow: IBasicTableRowInputData = {
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: 'Celkem'
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(stock.totalStockQuantity)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(costPerUnit, 2)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(stock.totalStockCost, 2)
        }
      ]
    };
    const data: IBasicTableInputData = { header, rows: [...rows, totalRow] };
    return new BasicTable(data);
  }

  private getTableRowDataFromStockBatch(
    stockBatch: IStockBatch
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getDayMonthYearString(stockBatch.added)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(stockBatch.quantity)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(stockBatch.costPerUnit, 2)
        },
        {
          type: BasicTableRowCellType.Display,
          data: this.formatterService.getRoundedNumberString(stockBatch.quantity * stockBatch.costPerUnit, 2)
        }
      ]
    }
    return row;
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
