import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { IFinancialUnit } from 'src/app/models/financial-unit';

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
      iconName: 'date_range',
      tab: Tab.FinancialPeriods,
      description: 'Účetní období'
    },
    {
      iconName: 'all_inbox',
      tab: Tab.FinancialAccounts,
      description: 'Finanční účty'
    },
    {
      iconName: 'shopping_cart',
      tab: Tab.InventoryGroups,
      description: 'Skupiny zásob'
    },
    {
      iconName: 'shopping_basket',
      tab: Tab.InventoryItems,
      description: 'Položky zásob'
    },
    {
      iconName: 'store',
      tab: Tab.Stocks,
      description: 'Stav zásob'
    },
    {
      iconName: 'file_copy',
      tab: Tab.TransactionTemplates,
      description: 'Šablony transakcí'
    },
    {
      iconName: 'local_shipping',
      tab: Tab.InventoryTransactions,
      description: 'Transakce'
    },
    {
      iconName: 'account_balance_wallet',
      tab: Tab.FinancialTransactions,
      description: 'Účetní zápisy'
    },
    {
      iconName: 'account_balance',
      tab: Tab.TrialBalance,
      description: 'Obratová předvaha'
    },
    {
      iconName: 'people',
      tab: Tab.Users,
      description: 'Uživatelé'
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
  tab: Tab;
  iconName: string;
  description: string;
}

enum Tab {
  FinancialPeriods = 'financial-periods',
  FinancialAccounts = 'financial-accounts',
  InventoryGroups = 'inventory-groups',
  InventoryItems = 'inventory-items',
  Stocks = 'stocks',
  TransactionTemplates = 'transaction-templates',
  InventoryTransactions = 'inventory-transactions',
  FinancialTransactions = 'financial-transactions',
  TrialBalance = 'trial-balance',
  Users = 'users'
}