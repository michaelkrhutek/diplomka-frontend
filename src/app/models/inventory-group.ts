import { StockValuationMethod } from './stock';

export interface INewInventoryGroupData {
  _id: string | null;
  name: string;
  defaultStockValuationMethod: string;
}

export interface IInventoryGroup {
    _id: string;
    name: string;
    defaultStockValuationMethod: string;
}

export class InventoryGroup {

    constructor(data: IInventoryGroup) {
        this._id = data._id;
        this.name = data.name;
        this.defaultStockValuationMethod = this.parseStockValuationMethodString(data.defaultStockValuationMethod);
    }

    _id: string;
    name: string;
    defaultStockValuationMethod: StockValuationMethod;

    private parseStockValuationMethodString(typeAsString: string): StockValuationMethod {
        switch (typeAsString) {
            case StockValuationMethod.FIFO.toString():
              return StockValuationMethod.FIFO;
            case StockValuationMethod.LIFO.toString():
              return StockValuationMethod.LIFO;
            case StockValuationMethod.Average.toString():
              return StockValuationMethod.Average;
            default:
              return null;
          }
    }
}