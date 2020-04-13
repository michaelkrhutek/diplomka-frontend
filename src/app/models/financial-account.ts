import { FinancialAccountType } from './financial-account-type';

export interface INewFinancialAccountData {
    _id: string;
    name: string;
    code: string;
    type: FinancialAccountType;
}

export interface IFinancialAccount {
    _id: string;
    name: string;
    code: string;
    type: FinancialAccountType;
}

export class FinancialAccount {

    constructor(data: IFinancialAccount) {
        this._id = data._id;
        this.name = data.name;
        this.code = data.code;
        this.type = data.type;
    }

    _id: string;
    name: string;
    code: string;
    type: FinancialAccountType;

    // private getAccountType(typeAsString: string): FinancialAccountType {
    //     switch (typeAsString) {
    //         case FinancialAccountType.Assets:
    //             return FinancialAccountType.Assets;
    //         case FinancialAccountType.Equity:
    //             return FinancialAccountType.Equity;
    //         case FinancialAccountType.Expenses:
    //             return FinancialAccountType.Expenses;
    //         case FinancialAccountType.Liabilities:
    //             return FinancialAccountType.Liabilities;
    //         case FinancialAccountType.Revenues:
    //             return FinancialAccountType.Revenues;
    //         default:
    //             return null;
    //     }
    // }
}