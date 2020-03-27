import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FinancialAccountService } from 'src/app/services/financial-account.service';
import { FinancialAccountType } from 'src/app/models/financial-account-type';

@Component({
  selector: 'app-new-financial-account-modal',
  templateUrl: './new-financial-account-modal.component.html',
  styleUrls: ['./new-financial-account-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFinancialAccountModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    private financialAccountService: FinancialAccountService
  ) { }

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  codeFC: FormControl = new FormControl(null);
  nameFC: FormControl = new FormControl(null);
  
  financialAccountFG: FormGroup = new FormGroup({
    code: this.codeFC,
    name: this.nameFC,
  });
  financialAccountFormData$: Observable<INewFinancialAccountFormData> = this.financialAccountFG.valueChanges.pipe(
    startWith(this.financialAccountFG)
  );

  financialAccountTypeOptions: IFinancialAccountTypeOption[] = this.financialAccountService.getAllFinancialAccountTypes()
    .map((type: FinancialAccountType) => {
        const name: string = this.financialAccountService.getFinancialAccountTypeName(type);
        const option: IFinancialAccountTypeOption = { type, name };
        return option;
    });

  isCreateButtonDisabled$: Observable<boolean> = this.financialAccountFormData$.pipe(
    map((formData: INewFinancialAccountFormData) => !this.getAreFinancialAccountFormDataValid(formData))
  );

  createFinancialAccount(): void {
    const code: string = this.codeFC.value;
    const name: string = this.nameFC.value;
    this.financialUnitDetailsService.createFinancialAccount(name, code);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }

  private getAreFinancialAccountFormDataValid(formData: INewFinancialAccountFormData): boolean {
    if (!formData.code || !formData.name) {
      return false;
    }
    if (!RegExp('^[0-9]').test(formData.code)) {
      return false;
    }
    return true;
  }
}

interface INewFinancialAccountFormData {
  code: string;
  name: string;
}

interface IFinancialAccountTypeOption {
  type: FinancialAccountType,
  name: string;
}
