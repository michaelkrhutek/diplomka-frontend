import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ClickableTile } from 'src/app/models/tiles-models';

@Component({
  selector: 'app-clickable-tile',
  templateUrl: './clickable-tile.component.html',
  styleUrls: ['./clickable-tile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClickableTileComponent {

  constructor() { }

  @Input() data: ClickableTile;

  getTileStyles(data: ClickableTile): Object {
    return {
      'width': `${data.width}rem`,
      'max-width': `${data.width}rem`,
      'height': `${data.height}rem`,
      'max-height': `${data.height}rem`,
    };
  } 
}
