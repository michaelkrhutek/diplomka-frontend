import { IInventoryItemPopulated } from './inventory-item';
import { IStock, Stock } from './stock';

export interface IInventoryItemStock {
    _id: IInventoryItemPopulated['_id'];
    inventoryItem: IInventoryItemPopulated;
    stock: IStock;
}

export class InventoryItemStock {

    constructor(data: IInventoryItemStock) {
        this._id = data._id;
        this.inventoryItem = data.inventoryItem;
        this.stock = new Stock(data.stock);
    }

    _id: IInventoryItemPopulated['_id'];
    inventoryItem: IInventoryItemPopulated;
    stock: IStock;
}