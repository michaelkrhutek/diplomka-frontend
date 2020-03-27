export interface IFinancialPeriod {
    _id: string;
    startDate: Date;
    endDate: Date;
}

export class FinancialPeriod {
    
    constructor(data: IFinancialPeriod) {
        this._id = data._id;
        this.startDate = new Date(data.startDate);
        this.endDate = new Date(data.endDate);
    }

    _id: string;
    startDate: Date;
    endDate: Date;
}