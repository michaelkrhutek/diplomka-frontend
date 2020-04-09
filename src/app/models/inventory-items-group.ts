import { StockDecrementType } from './stock';

export interface INewInventoryGroupData {
  _id: string | null;
  name: string;
  defaultStockDecrementType: string;
}

export interface IInventoryItemsGroup {
    _id: string;
    name: string;
    defaultStockDecrementType: string;
}

export class InventoryItemsGroup {

    constructor(data: IInventoryItemsGroup) {
        this._id = data._id;
        this.name = data.name;
        this.defaultStockDecrementType = this.parseStockDecrementTypeString(data.defaultStockDecrementType);
    }

    _id: string;
    name: string;
    defaultStockDecrementType: StockDecrementType;

    private parseStockDecrementTypeString(typeAsString: string): StockDecrementType {
        switch (typeAsString) {
            case StockDecrementType.FIFO.toString():
              return StockDecrementType.FIFO;
            case StockDecrementType.LIFO.toString():
              return StockDecrementType.LIFO;
            case StockDecrementType.Average.toString():
              return StockDecrementType.Average;
            default:
              return null;
          }
    }
}