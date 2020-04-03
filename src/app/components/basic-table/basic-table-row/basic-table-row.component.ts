import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BasicTableRow, BasicTableRowCell } from 'src/app/models/basic-table-models';

@Component({
  selector: 'app-basic-table-row',
  templateUrl: './basic-table-row.component.html',
  styleUrls: ['./basic-table-row.component.css', '../basic-table-header-and-row.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicTableRowComponent {

  constructor() { }

  @Input() data: BasicTableRow;

  getActionItemsContainerStyle(data: BasicTableRow): Object {
    return {
      'width': `${data.actionItemsContainerWidth}rem`,
      'max-width': `${data.actionItemsContainerWidth}rem`
    };
  }

  getCellStyle(item: BasicTableRowCell): Object {
    return {
      'width': `${item.width}rem`,
      'max-width': `${item.width}rem`,
      'text-align': item.align
    };
  }
}
