import { InventoryTransactionType } from './inventory-transaction-type';
import { IStockBatch, IStock } from './stock';
import { IInventoryItem } from './inventory-item';

export interface IIncrementInventoryTransactionSpecificData {
    quantity: number;
    costPerUnit: number;
};

export interface IDecrementInventoryTransactionSpecificData {
    quantity: number;
}

export interface INewInventoryTransactionRequestData<SpecificData> {
    inventoryItemId: string;
    description: string;
    effectiveDate: Date;
    addBeforeTransactionWithIndex?: number;
    debitAccountId: string;
    creditAccountId: string;
    specificData: SpecificData;
}

export interface IInventoryTransaction<SpecificData> {
    _id: string;
    type: InventoryTransactionType;
    inventoryItemId: IInventoryItem;
    description: string;
    effectiveDate: Date;
    debitAccountId: string;
    creditAccountId: string;
    specificData: SpecificData;
    totalTransactionAmount: number;
    stock: IStock;
    financialUnitId: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    transactionIdForcingDerivation: string | null;
    isActive?: boolean;
}