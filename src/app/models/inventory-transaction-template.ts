import { InventoryTransactionType } from './inventory-transaction-type';

export interface IInventoryTransactionTemplate {
    description: string;
    transactionType: InventoryTransactionType;
    financialUnitId: string;
    inventoryGroupId: string;
    debitAccountId: string;
    creditAccountId: string;
}