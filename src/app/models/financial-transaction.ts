import { IInventoryItem } from './inventory-item';
import { IFinancialAccount } from './financial-account';

export interface IFinancialTransactionPopulated {
    _id: string;
    effectiveDate: Date;
    amount: number;
    inventoryTransaction: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    inventoryTransactionIdForcingDerivation: string | null;
    isActive?: boolean;
    financialUnit: IFinancialUnit['_id'];
    inventroryItem: IInventoryItem,
    debitAccount: IFinancialAccount;
    creditAccount: IFinancialAccount;
    creator: IUser;
    created: Date;
}

export class FinancialTransactionPopulated {

    constructor(transaction: IFinancialTransactionPopulated) {
        Object.keys(transaction).forEach((key) => (this[key] = transaction[key]));
        this.effectiveDate = new Date(transaction.effectiveDate);
        this.created = new Date(transaction.created);
    }

    _id: string;
    effectiveDate: Date;
    amount: number;
    inventoryTransaction: string;
    inventoryItemTransactionIndex: number;
    isDerivedTransaction: boolean;
    inventoryTransactionIdForcingDerivation: string | null;
    isActive?: boolean;
    financialUnit: IFinancialUnit['_id'];
    inventroryItem: IInventoryItem;
    debitAccount: IFinancialAccount;
    creditAccount: IFinancialAccount;
    creator: IUser;
    created: Date;
}