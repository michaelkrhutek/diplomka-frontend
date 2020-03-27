import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialUnitsComponent } from './views/financial-units/financial-units.component';
import { FinancialUnitDetailsComponent } from './views/financial-unit-details/financial-unit-details.component';
import { GetFinancialUnitResolver } from './resolvers/get-financial-unit.resolver';


const routes: Routes = [
  {
    path: 'financial-units',
    component: FinancialUnitsComponent
  },
  {
    path: 'financial-unit/:financialUnitId',
    component: FinancialUnitDetailsComponent,
    resolve: { financialUnit: GetFinancialUnitResolver }
  },
  {
    path: '**',
    component: FinancialUnitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
