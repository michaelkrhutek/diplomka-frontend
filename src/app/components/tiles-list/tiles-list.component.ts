import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BasicTile, ClickableTile } from 'src/app/models/tiles-models';

@Component({
  selector: 'app-tiles-list',
  templateUrl: './tiles-list.component.html',
  styleUrls: ['./tiles-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilesListComponent {

  @Input() items: (BasicTile | ClickableTile)[];
  @Input() noRecordMessage: string = 'Žádný záznam nenalezen';
  @Input() isLoadingData: boolean = false;

  constructor() { }
}
