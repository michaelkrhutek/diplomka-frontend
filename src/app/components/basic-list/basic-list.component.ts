import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { IIconItem } from 'src/app/models/icon-item';
import { ListItem } from 'src/app/models/list-item';

@Component({
  selector: 'app-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: ['./basic-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicListComponent {

  constructor() { }

  @Input() listItems: ListItem[] = [];
  @Input() isLoadingData: boolean = false;
  @Input() noRecordMessage: string = 'Žádný záznam nenalazen';
  @Input() iconItem: IIconItem = null;
}
