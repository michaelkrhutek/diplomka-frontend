import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-inventory-transaction-details-modal',
  templateUrl: './inventory-transaction-details-modal.component.html',
  styleUrls: ['./inventory-transaction-details-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTransactionDetailsModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
