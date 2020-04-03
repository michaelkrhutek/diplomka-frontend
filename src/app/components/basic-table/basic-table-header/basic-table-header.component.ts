import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { IBasicTableHeaderCellInputData, BasicTableHeader } from 'src/app/models/basic-table-models';

@Component({
  selector: 'app-basic-table-header',
  templateUrl: './basic-table-header.component.html',
  styleUrls: ['../basic-table-header-and-row.css', './basic-table-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicTableHeaderComponent {

  @Input() data: BasicTableHeader;

  constructor() { }

  getActionItemsContainerStyle(data: BasicTableHeader): Object {
    return {
      'width': `${data.actionItemsContainerWidth}rem`,
      'max-width': `${data.actionItemsContainerWidth}rem`
    };
  }

  getStringItemStyle(item: IBasicTableHeaderCellInputData): Object {
    return {
      'width': `${item.width}rem`,
      'max-width': `${item.width}rem`,
      'text-align': item.align
    };
  }
}
