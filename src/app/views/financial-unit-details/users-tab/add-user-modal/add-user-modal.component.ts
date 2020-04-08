import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private userService: UserService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  userFC: FormControl = new FormControl(null);
  user$: Observable<IUser | string> = this.userFC.valueChanges.pipe(
    startWith(this.userFC.value)
  );

  users$: Observable<IUser[]> = this.user$.pipe(
    map((value: IUser | string) => this.displayUserFn(value)),
    switchMap((filterText: string) => this.userService.getUsers$(filterText))
  );

  isAddButtonDisabled$: Observable<boolean> = this.userFC.valueChanges.pipe(
    startWith(this.userFC.value),
    map((value: IUser | string) => !(value && typeof value != 'string'))
  );

  addUser(): void {
    const user: IUser = this.userFC.value;
    this.financialUnitDetailsService.addUser(user._id);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }

  displayUserFn(value: IUser | string): string {
    if (!value) {
      return '';
    }
    return typeof value == 'string' ? value : value.displayName;
  }
}
