import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BasicTable } from 'src/app/models/basic-table-models';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicTableComponent {

  constructor() { }

  @Input() data: BasicTable;
  @Input() isLoadingData: boolean = false;
  @Input() noRecordMessage: string = 'Žádný záznam nenalezen';
}
