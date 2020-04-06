import { InventoryTransactionType } from './inventory-transaction-type';
import { IFinancialAccount } from './financial-account';
import { IInventoryItemsGroup } from './inventory-items-group';

export interface INewInventoryTransactionTemplateRequestData {
    description: string;
    inventoryGroupId: string;
    transactionType: string;
    debitAccountId: string;
    creditAccountId: string;
}

export interface IInventoryTransactionTemplate {
    _id: string;
    description: string;
    transactionType: InventoryTransactionType;
    financialUnit: string;
    inventoryGroup: string;
    debitAccount: string;
    creditAccount: string;
}

export interface IInventoryTransactionTemplatePopulated {
    _id: string;
    description: string;
    transactionType: InventoryTransactionType;
    financialUnit: string;
    inventoryGroup: IInventoryItemsGroup;
    debitAccount: IFinancialAccount;
    creditAccount: IFinancialAccount;
}