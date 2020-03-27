import { InventoryTransactionType } from './inventory-transaction-type';
import { IFinancialAccount } from './financial-account';
import { IInventoryItemsGroup } from './inventory-items-group';

export interface IInventoryTransactionTemplate {
    description: string;
    transactionType: InventoryTransactionType;
    financialUnit: string;
    inventoryGroup: string;
    debitAccount: string;
    creditAccount: string;
}

export interface IInventoryTransactionTemplatePopulated {
    description: string;
    transactionType: InventoryTransactionType;
    financialUnit: string;
    inventoryGroup: IInventoryItemsGroup;
    debitAccount: IFinancialAccount;
    creditAccount: IFinancialAccount;
}