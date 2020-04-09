import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PaginatedTable } from 'src/app/models/paginated-table-models';

@Component({
  selector: 'app-paginated-table',
  templateUrl: './paginated-table.component.html',
  styleUrls: ['./paginated-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatedTableComponent {

  @Input() data: PaginatedTable<any, any>;
  @Input() noRecordMessage: string = 'Žádný záznam nenalezen';

  constructor() { }

  ngOnInit() { }
}
