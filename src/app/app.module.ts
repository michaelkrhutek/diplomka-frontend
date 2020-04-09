import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatCheckboxModule,
  MatSelectModule,
  MatTooltipModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatAutocompleteModule,
  MAT_DATE_FORMATS,
  DateAdapter,
  NativeDateModule
} from "@angular/material";
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { BasicListComponent } from './components/basic-list/basic-list.component';
import { PaginatedListComponent } from './components/paginated-list/paginated-list.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { IconItemComponent } from './components/icon-item/icon-item.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinancialUnitsComponent } from './views/financial-units/financial-units.component';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { FinancialUnitDetailsComponent } from './views/financial-unit-details/financial-unit-details.component';
import { NewFinancialUnitModalComponent } from './views/financial-units/new-financial-unit-modal/new-financial-unit-modal.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FinancialAccountsTabComponent } from './views/financial-unit-details/financial-accounts-tab/financial-accounts-tab.component';
import { FinancialPeriodsTabComponent } from './views/financial-unit-details/financial-periods-tab/financial-periods-tab.component';
import { NewFinancialPeriodModalComponent } from './views/financial-unit-details/financial-periods-tab/new-financial-period-modal/new-financial-period-modal.component';
import { NewFinancialAccountModalComponent } from './views/financial-unit-details/financial-accounts-tab/new-financial-account-modal/new-financial-account-modal.component';
import { InventoryItemsGroupsTabComponent } from './views/financial-unit-details/inventory-items-groups-tab/inventory-items-groups-tab.component';
import { NewInventoryItemsGroupModalComponent } from './views/financial-unit-details/inventory-items-groups-tab/new-inventory-items-group-modal/new-inventory-items-group-modal.component';
import { InventoryItemsTabComponent } from './views/financial-unit-details/inventory-items-tab/inventory-items-tab.component';
import { NewInventoryItemModalComponent } from './views/financial-unit-details/inventory-items-tab/new-inventory-item-modal/new-inventory-item-modal.component';
import { InventoryTransactionsTabComponent } from './views/financial-unit-details/inventory-transactions-tab/inventory-transactions-tab.component';
import { NewInventoryTransactionModalComponent } from './views/financial-unit-details/inventory-transactions-tab/new-inventory-transaction-modal/new-inventory-transaction-modal.component';
import { FinancialTransactionsTabComponent } from './views/financial-unit-details/financial-transactions-tab/financial-transactions-tab.component';
import { TrialBalanceTabComponent } from './views/financial-unit-details/trial-balance-tab/trial-balance-tab.component';
import { StocksTabComponent } from './views/financial-unit-details/stocks-tab/stocks-tab.component';
import { HttpWithCredentialsInterceptor } from './interceptors/http-with-credentials.interceptor';
import { LoginComponent } from './views/login/login.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { AuthService } from './services/auth.service';
import { InventoryTransactionDetailsModalComponent } from './views/financial-unit-details/inventory-transactions-tab/inventory-transaction-details-modal/inventory-transaction-details-modal.component';
import { BasicTableComponent } from './components/basic-table/basic-table.component';
import { BasicTableHeaderComponent } from './components/basic-table/basic-table-header/basic-table-header.component';
import { BasicTableRow } from './models/basic-table-models';
import { BasicTableRowComponent } from './components/basic-table/basic-table-row/basic-table-row.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { StockDetailsModalComponent } from './views/financial-unit-details/stocks-tab/stock-details-modal/stock-details-modal.component';
import { TilesListComponent } from './components/tiles-list/tiles-list.component';
import { BasicTileComponent } from './components/basic-tile/basic-tile.component';
import { ClickableTileComponent } from './components/clickable-tile/clickable-tile.component';
import { HeadingComponent } from './components/heading/heading.component';
import { InventoryTransactionTemplateComponent } from './views/financial-unit-details/inventory-transaction-template/inventory-transaction-template.component';
import { NewInventoryTransactionTemplateModalComponent } from './views/financial-unit-details/inventory-transaction-template/new-inventory-transaction-template-modal/new-inventory-transaction-template-modal.component';
import { UsersTabComponent } from './views/financial-unit-details/users-tab/users-tab.component';
import { AddUserModalComponent } from './views/financial-unit-details/users-tab/add-user-modal/add-user-modal.component';
import { AppDateAdapter } from './services/date-adapter.service';
import { PaginatedTableComponent } from './components/paginated-table/paginated-table.component';

export const getBaseUrl = () => {
  if (environment.production) {
    return document.getElementsByTagName('base')[0].href;
  } else {
    return 'https://localhost:3000/';
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BasicListComponent,
    PaginatedListComponent,
    LoadingModalComponent,
    ListItemComponent,
    IconItemComponent,
    FinancialUnitsComponent,
    SnackbarComponent,
    FinancialUnitDetailsComponent,
    NewFinancialUnitModalComponent,
    NavigationBarComponent,
    FinancialAccountsTabComponent,
    FinancialPeriodsTabComponent,
    NewFinancialPeriodModalComponent,
    NewFinancialAccountModalComponent,
    InventoryItemsGroupsTabComponent,
    NewInventoryItemsGroupModalComponent,
    InventoryItemsTabComponent,
    NewInventoryItemModalComponent,
    InventoryTransactionsTabComponent,
    NewInventoryTransactionModalComponent,
    FinancialTransactionsTabComponent,
    TrialBalanceTabComponent,
    StocksTabComponent,
    LoginComponent,
    SignUpComponent,
    InventoryTransactionDetailsModalComponent,
    BasicTableComponent,
    BasicTableHeaderComponent,
    BasicTableRowComponent,
    ConfirmationModalComponent,
    StockDetailsModalComponent,
    TilesListComponent,
    BasicTileComponent,
    ClickableTileComponent,
    HeadingComponent,
    InventoryTransactionTemplateComponent,
    NewInventoryTransactionTemplateModalComponent,
    UsersTabComponent,
    AddUserModalComponent,
    PaginatedTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: 'BASE_URL',
      useFactory: getBaseUrl,
      deps: []
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => async () => {
        return await authService.getUserFromCookie$().toPromise();
      },
      multi: true,
      deps: [AuthService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpWithCredentialsInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
