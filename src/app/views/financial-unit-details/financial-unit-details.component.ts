import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';

@Component({
  selector: 'app-financial-unit-details',
  templateUrl: './financial-unit-details.component.html',
  styleUrls: ['./financial-unit-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialUnitDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private financialUnitDetails: FinancialUnitDetailsService
  ) { }

  ngOnInit(): void {
    const financialUnit: IFinancialUnit = this.route.snapshot.data.financialUnit;
    this.financialUnitDetails.setFinancialUnit(financialUnit);
  }

  ngOnDestroy(): void {
    this.financialUnitDetails.setFinancialUnit(null);
  }

}
