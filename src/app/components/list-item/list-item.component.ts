import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ListItem } from 'src/app/models/list-item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent {

  constructor() { }

  @Input() data: ListItem;
  @Input() isBoxShadowVisible: boolean = true;
}
