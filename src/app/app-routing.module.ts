import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialUnitsComponent } from './views/financial-units/financial-units.component';
import { FinancialUnitDetailsComponent } from './views/financial-unit-details/financial-unit-details.component';
import { GetFinancialUnitResolver } from './resolvers/get-financial-unit.resolver';
import { LoginComponent } from './views/login/login.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { IsUserLoggedInGuard } from './guards/is-user-logged-in.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: '',
    component: FinancialUnitsComponent,
    canActivate: [IsUserLoggedInGuard]
  },
  {
    path: 'financial-unit/:financialUnitId',
    component: FinancialUnitDetailsComponent,
    canActivate: [IsUserLoggedInGuard],
    resolve: { financialUnit: GetFinancialUnitResolver }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
