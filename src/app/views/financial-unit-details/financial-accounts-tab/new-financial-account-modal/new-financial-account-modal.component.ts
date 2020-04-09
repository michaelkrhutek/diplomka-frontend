import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FinancialUnitDetailsService } from 'src/app/services/financial-unit-details.service';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { INewFinancialAccountData } from 'src/app/models/financial-account';

@Component({
  selector: 'app-new-financial-account-modal',
  templateUrl: './new-financial-account-modal.component.html',
  styleUrls: ['./new-financial-account-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFinancialAccountModalComponent {

  constructor(
    private financialUnitDetailsService: FinancialUnitDetailsService,
    // private financialAccountService: FinancialAccountService
  ) { }

  @Input() data: INewFinancialAccountData;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  headingText: string;
  buttonText: string;

  ngOnInit(): void {
    if (this.data._id) {
      this.headingText = 'Úprava finančního účtu'
      this.buttonText = 'Uložit';
      this.financialAccountFG.patchValue(this.data);
    } else {
      this.headingText = 'Nový finanční účet'
      this.buttonText = 'Vytvořit';
    }
  }

  financialAccountFG: FormGroup = new FormGroup({
    _id: new FormControl(null),
    code: new FormControl(null, [financialAccountCodeValidator]),
    name: new FormControl(null)
  });
  financialAccountFormData$: Observable<INewFinancialAccountData> = this.financialAccountFG.valueChanges.pipe(
    startWith(this.financialAccountFG)
  );

  codeFC: AbstractControl = this.financialAccountFG.controls['code'];

  // financialAccountTypeOptions: IFinancialAccountTypeOption[] = this.financialAccountService.getAllFinancialAccountTypes()
  //   .map((type: FinancialAccountType) => {
  //       const name: string = this.financialAccountService.getFinancialAccountTypeName(type);
  //       const option: IFinancialAccountTypeOption = { type, name };
  //       return option;
  //   });

  isCreateButtonDisabled$: Observable<boolean> = this.financialAccountFormData$.pipe(
    map((formData: INewFinancialAccountData) => !this.getAreFinancialAccountFormDataValid(formData))
  );

  createFinancialAccount(): void {
    const data: INewFinancialAccountData = this.financialAccountFG.value;
    if (data._id) {
      this.financialUnitDetailsService.updateFinancialAccount(data);
    } else {
      this.financialUnitDetailsService.createFinancialAccount(data);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }

  private getAreFinancialAccountFormDataValid(formData: INewFinancialAccountData): boolean {
    if (!formData.code || !formData.name) {
      return false;
    }
    if (!RegExp('^[0-9]+$').test(formData.code)) {
      return false;
    }
    return true;
  }

  getErrorMessage(errors: {[key: string]: string}): string {
    const errorKeys: string[] = Object.keys(errors);
    const errorMessage: string = errors[errorKeys[0]];
    return errorMessage;
  }
}



const financialAccountCodeValidator = (control: AbstractControl): {[key: string]: string} | null => {
  const errors: {[key: string]: string} = {};
  const code: string = control.value || '';
  const regex: RegExp = /^[0-9]+$/;
  const invalidSymbol: boolean = regex.test(code);
  if (!invalidSymbol) {
    errors['invalidSymbol'] = 'Kód se může skládat pouze z číslic';
  }
  // const invalidLength: boolean = projectCode.length == 4;
  // if (!invalidLength) {
  //   errors['invalidLength'] = 'Code must have 4 symbols';
  // }
  return Object.keys(errors).length > 0 ? errors : null;
};