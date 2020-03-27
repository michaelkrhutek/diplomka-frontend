import { Observable, of } from "rxjs";

export interface ITextItem {
    label: string;
    value: string | Observable<string>;
    width: number;
}

export class TextItem {

    constructor(data: ITextItem) {
        this.label = data.label || '';
        this.value$ = this.getValueAsObservable(data.value);
        this.width = data.width || 0;
    }

    label: string;
    value$: Observable<string>;
    width: number;

    private getValueAsObservable(value: string | Observable<string>): Observable<string> {
        if (!value) {
            return of('');
        }
        if (typeof value == 'string') {
            return of(value);
        }
        return value;
    }
}