import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { IInventoryItemStock } from 'src/app/models/inventory-item-stock';
import { StockService } from 'src/app/services/stock.service';
import { BasicTable } from 'src/app/models/basic-table-models';

@Component({
  selector: 'app-stock-details-modal',
  templateUrl: './stock-details-modal.component.html',
  styleUrls: ['./stock-details-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockDetailsModalComponent implements OnInit {

  constructor(
    private stockService: StockService
  ) { }

  @Input() itemStock: IInventoryItemStock;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  tableData: BasicTable = null;

  ngOnInit() {
    this.tableData = this.stockService.getTableDataFromStock(this.itemStock.stock);
  }

  closeModal(): void {
    this.close.emit();
  }
}
