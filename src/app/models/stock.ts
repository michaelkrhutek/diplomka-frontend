export enum StockValuationMethod {
    FIFO = 'fifo',
    LIFO = 'lifo',
    Average = 'average'
}

export interface IStock {
    totalStockQuantity: number;
    totalStockCost: number;
    batches: IStockBatch[];
}

export interface IStockBatch {
    quantity: number;
    costPerUnit: number;
    added: Date;
    transactionIndex: number;
}

export class Stock {

    constructor(data: IStock) {
        this.totalStockQuantity = data.totalStockQuantity;
        this.costPerUnit = data.totalStockQuantity ? data.totalStockCost / data.totalStockQuantity : 0;
        this.totalStockCost = data.totalStockCost;
        this.batches = data.batches
            .map(b => new StockBatch(b))
            .sort((a, b) => a.added.getTime() - b.added.getTime());
    }

    totalStockQuantity: number;
    totalStockCost: number;
    costPerUnit: number;
    batches: IStockBatch[];
}

export class StockBatch {

    constructor(data: IStockBatch) {
        this.quantity = data.quantity;
        this.costPerUnit = data.costPerUnit;
        this.totalCost = data.quantity * data.costPerUnit;
        this.added = new Date(data.added);
        this.transactionIndex = data.transactionIndex;
    }

    quantity: number;
    costPerUnit: number;
    totalCost: number;
    added: Date;
    transactionIndex: number;
}