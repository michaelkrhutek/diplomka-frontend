import { InventoryTransactionType } from './inventory-transaction-type';
import { IStock } from './stock';
import { IInventoryItem } from './inventory-item';
import { IFinancialAccount } from './financial-account';

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
    inventoryItem: IInventoryItem;
    description: string;
    effectiveDate: Date;
    debitAccount: IFinancialAccount;
    creditAccount: IFinancialAccount;
    specificData: SpecificData;
    totalTransactionAmount: number;
    stock: IStock;
    financialUnit: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    transactionForcingDerivation: string | null;
    isActive?: boolean;
}