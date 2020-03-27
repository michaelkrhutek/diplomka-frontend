import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-paginated-list',
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatedListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
