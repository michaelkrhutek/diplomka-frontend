import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BasicTile } from 'src/app/models/tiles-models';

@Component({
  selector: 'app-basic-tile',
  templateUrl: './basic-tile.component.html',
  styleUrls: ['./basic-tile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicTileComponent {

  @Input() data: BasicTile;

  constructor() { }

  getTileStyles(data: BasicTile): Object {
    return {
      'width': `${data.width}rem`,
      'max-width': `${data.width}rem`,
      'height': `${data.height}rem`,
      'max-height': `${data.height}rem`,
    };
  } 

  getTitleTextStyles(data: BasicTile): Object {
    return {
      'height': `${data.titleTextHeight}rem`,
      'max-height': `${data.titleTextHeight}rem`,      
    };
  }

  doAction(event: Event, itemAction: () => null): void {
    event.stopPropagation();
    itemAction && itemAction();
  }
}
