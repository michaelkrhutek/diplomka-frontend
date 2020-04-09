import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { UserService } from 'src/app/services/user.service';
import { Observable, of, combineLatest } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType, BasicTableActionItemsPosition } from 'src/app/models/basic-table-models';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private userService: UserService,
    private popUpsService: PopUpsService,
    private authService: AuthService
  ) { }

  isLoadingData: boolean = true;
  isAddUserModalOpened: boolean = false;

  isUserOwner$: Observable<boolean> = this.financialUnitDetailsService.isUserOwner$;

  users$: Observable<IUser[]> = combineLatest(
    this.financialUnitDetailsService.financialUnitId$,
    this.financialUnitDetailsService.reloadUsers$
  ).pipe(
    tap(() => (this.isLoadingData = true)),
    switchMap(([financialUnitId]) => financialUnitId ? this.userService.getFinancialUnitUsers$(financialUnitId) : of([]))
  )

  tableData$: Observable<BasicTable> = this.users$.pipe(
    map((users: IUser[]) => this.getTableDataFromUsers(users)),
    tap(() => (this.isLoadingData = false)),
  );

  private getTableDataFromUsers(
    users: IUser[]
  ): BasicTable {
    const header: IBasicTableHeaderInputData = {
      actionItemsContainerWidth: 1,
      actionItemsPosition: BasicTableActionItemsPosition.Start,
      otherCells: [
        {
          name: 'Uživatel',
          width: 12,
          align: BasicTableValueAlign.Left
        }
      ]
    };
    const rows: IBasicTableRowInputData[] = (users || [])
      .map(user => this.getTableRowDataFromUser(user));
    const data: IBasicTableInputData = { header, rows };
    return new BasicTable(data);
  }

  private getTableRowDataFromUser(
    user: IUser
  ): IBasicTableRowInputData {
    const row: IBasicTableRowInputData = {
      actionItems: combineLatest(
        this.financialUnitDetailsService.isUserOwner$,
        this.authService.userId$
      ).pipe(
        map(([isUserOwner, userId]) => isUserOwner && user._id != userId ? [{
          iconName: 'delete',
          description: 'Odebrat',
          action: () => this.removeUser(user)
        }] : [])
      ),
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: user.displayName
        }
      ]
    }
    return row;
  }

  removeUser(user: IUser): void {
    const data: IConfirmationModalData = {
      message: `Opravdu chcete odebrat uživateli ${user.displayName} přístup?`,
      action: () => this.financialUnitDetailsService.removeUser(user._id)
    }
    this.popUpsService.openConfirmationModal(data);
  }

  openAddUserModal(): void {
    this.isAddUserModalOpened = true;
  }

  closeAddUserModal(): void {
    this.isAddUserModalOpened = false;
  }
}
