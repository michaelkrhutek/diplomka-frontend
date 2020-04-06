import { Observable } from "rxjs";
import { IIconItem } from './icon-item';

export class IBasicTile {
    type: TileType;
    mainAction?: () => void;
    topLeftActionItems$?: Observable<IIconItem[]>;
    topRightActionItems$?: Observable<IIconItem[]>;
    bottomLeftActionItems$?: Observable<IIconItem[]>;
    bottomRightActionItems$?: Observable<IIconItem[]>;
    titleText?: string;
    otherTexts?: string[];
    width?: number;
    height?: number;
}

export class BasicTile {

    constructor(data: IBasicTile) {
        Object.keys(data).forEach((key: string) => this[key] = data[key]);
        this.hasMainAction = !!this.mainAction;
    }

    type: TileType;
    hasMainAction: boolean;
    mainAction: () => void;
    topLeftActionItems$: Observable<IIconItem[]>;
    topRightActionItems$: Observable<IIconItem[]>;
    bottomLeftActionItems$: Observable<IIconItem[]>;
    bottomRightActionItems$: Observable<IIconItem[]>;
    titleText: string = '';
    otherTexts: string[] = [];
    width: number = 12;
    height: number = 16;
    titleTextHeight: number = 3;
}

export interface IClickableTile {
    type: TileType;
    titleText: string;
    iconName: string;
    action: () => void;  
    width?: number;
    height?: number;  
}

export class ClickableTile {

    constructor(data: IClickableTile) {
        Object.keys(data).forEach((key: string) => this[key] = data[key]);
    }

    type: TileType;
    titleText: string;
    iconName: string ; 
    action: () => void;
    width: number = 12;
    height: number = 16; 
}

export enum TileType {
    Basic = 'basic', Clickable = 'clickable'
}