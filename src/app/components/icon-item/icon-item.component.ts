import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { IIconItem } from 'src/app/models/icon-item';

@Component({
  selector: 'app-icon-item',
  templateUrl: './icon-item.component.html',
  styleUrls: ['./icon-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconItemComponent {

  constructor() { }

  @Input() data: IIconItem;
}
