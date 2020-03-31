import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { Observable } from 'rxjs';

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

  activeTab = Tab.FinancialPeriods;

  sideNavigationBarItems: ISideNavigationBarItem[] = [
    {
      tab: Tab.FinancialPeriods,
      description: 'Obdobi'
    },
    {
      tab: Tab.InventoryTransactions,
      description: 'Transakce'
    },
    {
      tab: Tab.FinancialTransactions,
      description: 'Zapisy'
    }
  ];

  ngOnInit(): void {
    const financialUnit: IFinancialUnit = this.route.snapshot.data.financialUnit;
    this.financialUnitDetails.setFinancialUnit(financialUnit);
  }

  ngOnDestroy(): void {
    this.financialUnitDetails.setFinancialUnit(null);
  }

  setActiveTab(tab: Tab): void {
    this.activeTab = tab;
  }
}

interface ISideNavigationBarItem {
  tab: Tab,
  description: string
}

enum Tab {
  FinancialPeriods = 'financial-periods',
  FinancialAccounts = 'financial-accounts',
  InventoryGroups = 'inventory-groups',
  InventoryItems = 'inventory-items',
  Stocks = 'stocks',
  InventoryTransactions = 'inventory-transactions',
  FinancialTransactions = 'financial-transactions',
  TrialBalance = 'trial-balance'
}