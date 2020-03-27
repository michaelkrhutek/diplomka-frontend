import { FinancialAccountType } from './financial-account-type';

export interface IFinancialAccount {
    _id: string;
    name: string;
    code: string;
    accountType: string;
}

export class FinancialAccount {

    constructor(data: IFinancialAccount) {
        this._id = data._id;
        this.name = data.name;
        this.code = data.code;
        this.type = this.getAccountType(data.accountType);
    }

    _id: string;
    name: string;
    code: string;
    type: FinancialAccountType;

    private getAccountType(typeAsString: string): FinancialAccountType {
        switch (typeAsString) {
            case FinancialAccountType.Assets:
                return FinancialAccountType.Assets;
            case FinancialAccountType.Equity:
                return FinancialAccountType.Equity;
            case FinancialAccountType.Expenses:
                return FinancialAccountType.Expenses;
            case FinancialAccountType.Liabilities:
                return FinancialAccountType.Liabilities;
            case FinancialAccountType.Revenues:
                return FinancialAccountType.Revenues;
            default:
                return null;
        }
    }
}