import { IInventoryItemsGroup } from './inventory-items-group';

export interface IInventoryItem {
    _id: string;
    name: string;
    inventoryGroup: string;    
}

export interface IInventoryItemPopulated {
    _id: string;
    name: string;
    inventoryGroup: IInventoryItemsGroup;    
}

export class InventoryItem {

    constructor(data: IInventoryItemPopulated) {
        this._id = data._id;
        this.name = data.name;
        this.inventoryGroup = data.inventoryGroup;
    }

    _id: string;
    name: string;
    inventoryGroup: IInventoryItemsGroup;
}