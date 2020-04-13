import { InventoryTransactionType } from './inventory-transaction-type';

export interface IInventoryTransactionTemplateFilteringCriteria {
    filterText: string,
    transactionType: InventoryTransactionType,
    inventoryGroupId: string
}