import { InventoryTransactionType } from './inventory-transaction-type';
import { IStock } from './stock';
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

export interface IInventoryTransactionPopulated<SpecificData> {
    _id: string;
    type: InventoryTransactionType;
    inventoryItem: IInventoryItem;
    description: string;
    effectiveDate: Date;
    debitAccount: string;
    creditAccount: string;
    specificData: SpecificData;
    totalTransactionAmount: number;
    stockBeforeTransaction: IStock;
    stockAfterTransaction: IStock;
    financialUnit: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    transactionForcingDerivation: string | null;
    isActive?: boolean;
}

export class InventoryTransactionPopulated<SpecificData> {

    constructor(transaction: IInventoryTransactionPopulated<any>) {
        Object.keys(transaction).forEach((key) => (this[key] = transaction[key]));
        this.effectiveDate = new Date(transaction.effectiveDate);
        this.stockBeforeTransaction.batches.forEach((batch) => {
            batch.added = new Date(batch.added);
        });
        this.stockAfterTransaction.batches.forEach((batch) => {
            batch.added = new Date(batch.added);
        });
    }

    _id: string;
    type: InventoryTransactionType;
    inventoryItem: IInventoryItem;
    description: string;
    effectiveDate: Date;
    debitAccount: string;
    creditAccount: string;
    specificData: SpecificData;
    totalTransactionAmount: number;
    stockBeforeTransaction: IStock;
    stockAfterTransaction: IStock;
    financialUnit: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    transactionForcingDerivation: string | null;
    isActive?: boolean;
}