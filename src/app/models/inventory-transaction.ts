import { InventoryTransactionType } from './inventory-transaction-type';
import { IStock, Stock, StockValuationMethod } from './stock';
import { IInventoryItem } from './inventory-item';

export interface IIncrementInventoryTransactionSpecificData {
    quantity: number;
    costPerUnit: number;
};

export interface IDecrementInventoryTransactionSpecificData {
    quantity: number;
}

export interface ISaleInventoryTransactionSpecificData {
    quantity: number;
    pricePerUnit: number;
    saleDebitAccountId: string;
    saleCreditAccountId: string;
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
    stockValuationMethodApplied: StockValuationMethod;
    financialUnit: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    transactionForcingDerivation: string | null;
    isActive?: boolean;
    creator: IUser;
    created: Date;
}

export class InventoryTransactionPopulated<SpecificData> {

    constructor(transaction: IInventoryTransactionPopulated<any>) {
        Object.keys(transaction).forEach((key) => (this[key] = transaction[key]));
        this.effectiveDate = new Date(transaction.effectiveDate);
        this.created = new Date(transaction.created);
        this.stockBeforeTransaction = new Stock(transaction.stockBeforeTransaction);
        this.stockAfterTransaction = new Stock(transaction.stockAfterTransaction);
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
    stockBeforeTransaction: Stock;
    stockAfterTransaction: Stock;
    stockValuationMethodApplied: StockValuationMethod;
    financialUnit: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    transactionForcingDerivation: string | null;
    isActive?: boolean;
    creator: IUser;
    created: Date;
}