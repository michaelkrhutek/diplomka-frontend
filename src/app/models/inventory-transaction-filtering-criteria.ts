import { InventoryTransactionType } from './inventory-transaction-type';

export interface IInventoryTransactionFilteringCriteria {
    inventoryItemId: string;
    transactionType: InventoryTransactionType;
    dateFrom: Date;
    dateTo: Date;
}