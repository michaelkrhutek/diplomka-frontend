import { FinancialAccountType } from './financial-account-type';

export interface IFinancialAccountFilteringCriteria {
    filterText: string;
    type: FinancialAccountType;
}