import { Injectable } from '@angular/core';
import { StockDecrementType } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor() { }

  getAllStockDecrementType(): StockDecrementType[] {
    return [
      StockDecrementType.FIFO,
      StockDecrementType.LIFO,
      StockDecrementType.Average
    ];
  }

  getStockDecrementTypeDescription(type: StockDecrementType): string {
    switch (type) {
      case StockDecrementType.FIFO:
        return 'FIFO';
      case StockDecrementType.LIFO:
        return 'LIFO';
      case StockDecrementType.Average:
        return 'Vážený průměr';
      default:
        return 'N/A';
    }
  }
}
