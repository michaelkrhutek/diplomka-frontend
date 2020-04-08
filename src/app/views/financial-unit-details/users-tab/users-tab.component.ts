import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { UserService } from 'src/app/services/user.service';
import { Observable, of, combineLatest } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { BasicTable, IBasicTableHeaderInputData, BasicTableValueAlign, IBasicTableRowInputData, IBasicTableInputData, BasicTableRowCellType } from 'src/app/models/basic-table-models';

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTabComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private userService: UserService
  ) { }

  isLoadingData: boolean = true;
  isAddUserModalOpened: boolean = false;

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
      otherCells: [
        {
          type: BasicTableRowCellType.Display,
          data: user.displayName
        }
      ]
    }
    return row;
  }

  openAddUserModal(): void {
    this.isAddUserModalOpened = true;
  }

  closeAddUserModal(): void {
    this.isAddUserModalOpened = false;
  }
}
