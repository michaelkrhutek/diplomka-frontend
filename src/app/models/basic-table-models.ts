import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { isArray } from "util";
import { IIconItem } from './icon-item';


export enum BasicTableRowCellType {
    Display = 'display', Edit = 'edit', Checkbox = 'checkbox'
}
export type BasicTableRowCellTypes = BasicTableRowCellType.Display | BasicTableRowCellType.Edit | BasicTableRowCellType.Checkbox;
export type BasicTableRowCells = BasicTableRowDisplayCell | BasicTableRowEditCell | BasicTableRowCheckboxCell;

export interface IBasicTableInputData {
    header: IBasicTableHeaderInputData;
    rows: IBasicTableRowInputData[];
}



export interface IBasicTableHeaderInputData {
    stickyCells?: IBasicTableHeaderCellInputData[];
    otherCells?: IBasicTableHeaderCellInputData[];
    actionItemsPosition?: BasicTableActionItemsPosition;
    actionItemsName?: string;
    actionItemsContainerWidth?: number;
}



export interface IBasicTableHeaderCellInputData {
    name: string;
    width: number;
    align: BasicTableValueAlign;
}



export interface IBasicTableRowInputData {
    stickyCells?: (IBasicTableRowDisplayCellInputData | IBasicTableRowEditCellInputData | IBasicTableRowCheckboxCellInputData)[];
    otherCells?: (IBasicTableRowDisplayCellInputData | IBasicTableRowEditCellInputData | IBasicTableRowCheckboxCellInputData)[];
    actionItems?: IIconItem[] | Observable<IIconItem[]>;
}



export interface BasicTableRowCellInputData {
    type: BasicTableRowCellTypes;
    data: any;
}



export interface IBasicTableRowDisplayCellInputData {
    type: BasicTableRowCellType.Display;
    data: string | Observable<string>;
}



export interface IBasicTableRowEditCellInputData {
    type: BasicTableRowCellType.Edit;
    data: IBasicTableRowEditCellDataInputData;
}



export interface IBasicTableRowCheckboxCellInputData {
    type: BasicTableRowCellType.Checkbox;
    data: IBasicTableRowCheckboxCellDataInputData;
}



export interface IBasicTableRowEditCellDataInputData {
    value$: Observable<string | number>;
    isNumber: boolean;
    onChangeAction: (val: string) => void;
}



export interface IBasicTableRowCheckboxCellDataInputData {
    value$: Observable<boolean>;
    onChangeAction: (val: boolean) => void;
    isEditModeOn$?: Observable<boolean>;
    displayFn?: (val: boolean) => string;
}



export class BasicTable {

    constructor(data: IBasicTableInputData) {
        this.header = new BasicTableHeader(data.header);
        this.rows = data.rows.map((rowData: IBasicTableRowInputData) => new BasicTableRow(rowData, this.header));
    }

    header: BasicTableHeader;
    rows: BasicTableRow[];
}



export class BasicTableHeader {

    constructor(data: IBasicTableHeaderInputData) {
        this.stickyCells = data.stickyCells || [];
        this.otherCells = data.otherCells || [];
        this.actionItemsPosition = data.actionItemsPosition || BasicTableActionItemsPosition.Start;
        this.actionItemsName = data.actionItemsName || '';
        this.actionItemsContainerWidth = 3 * (data.actionItemsContainerWidth || 0);
    }

    stickyCells: IBasicTableHeaderCellInputData[];
    otherCells: IBasicTableHeaderCellInputData[];
    actionItemsPosition: BasicTableActionItemsPosition;
    actionItemsName: string;
    actionItemsContainerWidth: number;
}



export class BasicTableRow {

    constructor(rowData: IBasicTableRowInputData, header: BasicTableHeader) {
        this.stickyCells = header.stickyCells.map((headerCell, i) => {
            const rowCell: BasicTableRowCellInputData = (rowData.stickyCells || [])[i] || null;
            const cellType: BasicTableRowCellType = rowCell ? rowCell.type : BasicTableRowCellType.Display;
            const cellData: any = rowCell ? rowCell.data : null;
            return this.getRowCell(cellType, cellData, headerCell);
        });
        this.otherCells = header.otherCells.map((headerCell, i) => {
            const rowCell: BasicTableRowCellInputData = (rowData.otherCells || [])[i] || null;
            const cellType: BasicTableRowCellType = rowCell ? rowCell.type : BasicTableRowCellType.Display;
            const cellData: any = rowCell ? rowCell.data : null;
            return this.getRowCell(cellType, cellData, headerCell);
        });
        this.actionItemsPosition = header.actionItemsPosition;
        this.actionItems$ = this.getActionItems(rowData.actionItems);
        this.actionItemsContainerWidth = header.actionItemsContainerWidth;     
    }

    stickyCells: (BasicTableRowDisplayCell | BasicTableRowEditCell | BasicTableRowCheckboxCell)[];
    stickyCellsContainerWidth: number;
    otherCells: (BasicTableRowDisplayCell | BasicTableRowEditCell | BasicTableRowCheckboxCell)[];
    otherCellsContainerWidth: number;
    actionItemsPosition: BasicTableActionItemsPosition;
    actionItems$: Observable<IIconItem[]>;
    actionItemsContainerWidth: number;

    private getRowCell(cellType: BasicTableRowCellType, rowCellData: any, headerCellData: IBasicTableHeaderCellInputData): BasicTableRowCells {
        switch (cellType) {
            case BasicTableRowCellType.Display:
                const displayCellData: string | Observable<string> = rowCellData;
                return new BasicTableRowDisplayCell(displayCellData, headerCellData);
            case BasicTableRowCellType.Edit:
                const editCellData: IBasicTableRowEditCellDataInputData = rowCellData;
                return new BasicTableRowEditCell(editCellData, headerCellData);
            case BasicTableRowCellType.Checkbox:
                const checkboxCellData: IBasicTableRowCheckboxCellDataInputData = rowCellData;
                return new BasicTableRowCheckboxCell(checkboxCellData, headerCellData);
            default:
                return null;
        }
    }

    private getActionItems(items: IIconItem[] | Observable<IIconItem[]>): Observable<IIconItem[]> {
        if (!items) {
            return of([]);
        } else if (isArray(items)) {
            return of(items as IIconItem[]);
        } else {
            return items as Observable<IIconItem[]>;
        }
    }
}



export class BasicTableRowCell {

    constructor(type: BasicTableRowCellType, headerCellData: IBasicTableHeaderCellInputData) {
        this.width = headerCellData.width;
        this.align = headerCellData.align;
        this.type = type;
    }

    width: number;
    align: BasicTableValueAlign;
    type: BasicTableRowCellType;
}



export class BasicTableRowDisplayCell extends BasicTableRowCell {

    constructor(rowCellData: string | Observable<string>, headerCellData: IBasicTableHeaderCellInputData) {
        super(BasicTableRowCellType.Display, headerCellData);
        this.text$ = rowCellData ? (typeof rowCellData == 'string' ? of(rowCellData) : rowCellData) : of('');
    }

    text$: Observable<string>;
}



export class BasicTableRowEditCell extends BasicTableRowCell {

    constructor(rowCellData: IBasicTableRowEditCellDataInputData, headerCellData: IBasicTableHeaderCellInputData) {
        super(BasicTableRowCellType.Edit, headerCellData);
        this.value$ = rowCellData.value$;
        this.isNumber = rowCellData.isNumber;
        this.onChangeAction = rowCellData.onChangeAction;
    }

    value$: Observable<string | number>;
    isNumber: boolean;
    onChangeAction: (val: string) => void;
}



export class BasicTableRowCheckboxCell extends BasicTableRowCell {

    constructor(rowCellData: IBasicTableRowCheckboxCellDataInputData, headerCellData: IBasicTableHeaderCellInputData) {
        super(BasicTableRowCellType.Checkbox, headerCellData);
        this.value$ = rowCellData.value$;
        this.onChangeAction = rowCellData.onChangeAction;
        this.isEditModeOn$ = rowCellData.isEditModeOn$ || of(false);
        const displayFn = rowCellData.displayFn || ((val: boolean) => val ? 'Yes' : 'No');
        this.displayValue$ = this.value$.pipe(map((val: boolean) => displayFn(val)));

    }

    value$: Observable<boolean>;
    onChangeAction: (val: boolean) => void;
    isEditModeOn$: Observable<boolean>;
    displayValue$: Observable<string>;
}



export enum BasicTableActionItemsPosition {
    Start = 'start', End = 'end'
}



export enum BasicTableValueAlign {
    Left = 'left', Center = 'center', Right = 'right'
}