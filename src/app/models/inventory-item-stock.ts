import { IInventoryItemPopulated } from './inventory-item';
import { IStock } from './stock';

export interface IInventoryItemStock {
    _id: IInventoryItemPopulated['_id'];
    inventoryItem: IInventoryItemPopulated;
    stock: IStock;
}