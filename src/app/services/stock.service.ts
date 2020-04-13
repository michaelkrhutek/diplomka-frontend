import { Injectable } from '@angular/core';
import { StockValuationMethod, IStock, IStockBatch } from '../models/stock';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, BasicTableRowCellType, IBasicTableInputData } from '../models/basic-table-models';
import { FormatterService } from './formatter.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private formatterService: FormatterService
  ) { }

  getAllStockValuationMethod(): StockValuationMethod[] {
    return [
      StockValuationMethod.FIFO,
      StockValuationMethod.LIFO,
      StockValuationMethod.Average
    ];
  }

  getStockValuationMethodDescription(type: StockValuationMethod): string {
    switch (type) {
      case StockValuationMethod.FIFO:
        return 'FIFO';
      case StockValuationMethod.LIFO:
        return 'LIFO';
      case StockValuationMethod.Average:
        return 'Vážený průměr';
      default:
        return 'N/A';
    }
  }

  getTableDataFromStock(
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
      .sort((a, b) => a.transactionIndex - b.transactionIndex)
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

  getTableRowDataFromStockBatch(
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
}
