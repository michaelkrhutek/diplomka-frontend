import { IIconItem } from "./icon-item";
import { Observable, of } from 'rxjs';
import { ITextItem, TextItem } from './text-item';

export interface IListItem {
    textItems: ITextItem[];
    iconItemsStart?: IIconItem[] | Observable<IIconItem[]>;
    iconItemsStartContainerWidth?: number;
    iconItemsEnd?: IIconItem[] | Observable<IIconItem[]>;
    iconItemsEndContainerWidth?: number;
}

export class ListItem {

    constructor(data: IListItem) {
        this.textItems = (data.textItems || []).map((item: ITextItem) => new TextItem(item));
        this.iconItemsStart$ = this.getIconItemsAsObservable(data.iconItemsStart);
        this.iconItemsStartContainerWidth = data.iconItemsStartContainerWidth || 0;
        this.iconItemsEnd$ = this.getIconItemsAsObservable(data.iconItemsEnd);
        this.iconItemsEndContainerWidth = data.iconItemsEndContainerWidth || 0;
    }

    textItems: TextItem[];
    iconItemsStart$: Observable<IIconItem[]>;
    iconItemsStartContainerWidth: number;
    iconItemsEnd$: Observable<IIconItem[]>;
    iconItemsEndContainerWidth: number;

    private getIconItemsAsObservable(iconItems: IIconItem[] | Observable<IIconItem[]>): Observable<IIconItem[]> {
        if (!iconItems) {
            return of([]);
        }
        if (Array.isArray(iconItems)) {
            return of(iconItems);
        }
        return iconItems;
    }
}