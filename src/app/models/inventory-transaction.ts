import { InventoryTransactionType } from './inventory-transaction-type';
import { IStock } from './stock';
import { IInventoryItem } from './inventory-item';
import { IFinancialAccount } from './financial-account';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';

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
    stock: IStock;
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
    stock: IStock;
    financialUnit: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    transactionForcingDerivation: string | null;
    isActive?: boolean;
}