import { IFinancialAccount } from './financial-account';
import { FinancialAccountType } from './financial-account-type';

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
        this.accounts = trialBalance.accounts.sort((a, b) => a.account.code > b.account.code ? 1 : -1);
        this.profitOrLoss = 0;
        this.accounts.forEach((account) => {
            if ([FinancialAccountType.Expenses, FinancialAccountType.Revenues].includes(account.account.type)) {
                this.profitOrLoss += account.creditAmount;
                this.profitOrLoss -= account.debitAmount;
            }
        });
    }

    financialUnitId: string;
    startDate: Date;
    endDate: Date;
    totalDebitAmount: number;
    totalDebitEntries: number;
    totalCreditAmount: number;
    totalCreditEntries: number;
    profitOrLoss: number;
    accounts: ITrialBalanceAccount[];
}