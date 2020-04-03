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
  MatNativeDateModule
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
import { HttpWithCredentialsInterceptor } from './interceptors/http-with-credentials.inverceptor';
import { LoginComponent } from './views/login/login.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { AuthService } from './services/auth.service';

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
    SignUpComponent
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
    BrowserAnimationsModule
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
