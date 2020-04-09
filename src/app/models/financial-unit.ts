import { StockDecrementType } from "./stock";

export interface IFinancialUnit {
    _id: string;
    name: string;
    owner: string;
}

export interface INewFinancialUnitData {
    name: string;
    createDefaultData: boolean;
    stockDecrementType: StockDecrementType
}