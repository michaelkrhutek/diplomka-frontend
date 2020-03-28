import { IFinancialAccount } from './financial-account';

export interface ITrialBalanceAccount {
    _id: string;
    account: IFinancialAccount | null;
    debitAmount: number;
    debitEntriesCount: number;
    creditAmount: number;
    creditEntriesCount: number;
}

export interface ITrialBalance {
    financialUnitId: string;
    startDate: Date;
    endDate: Date;
    totalDebitAmount: number;
    totalDebitEntries: number;
    totalCreditAmount: number;
    totalCreditEntries: number;
    accounts: ITrialBalanceAccount[];
}

export class TrialBalance {
    
    constructor(trialBalance: ITrialBalance) {
        Object.keys(trialBalance).forEach((key) => (this[key] = trialBalance[key]));
        this.startDate = new Date(trialBalance.startDate);
        this.endDate = new Date(trialBalance.endDate);
    }

    financialUnitId: string;
    startDate: Date;
    endDate: Date;
    totalDebitAmount: number;
    totalDebitEntries: number;
    totalCreditAmount: number;
    totalCreditEntries: number;
    accounts: ITrialBalanceAccount[];
}