import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoadingModalData } from '../models/loading-modal-data';
import { ISnackbarData, SnackbarType } from '../models/snackbar-data';
import { HttpErrorResponse } from '@angular/common/http';
import { IConfirmationModalData } from '../models/confirmation-modal-data';

@Injectable({
  providedIn: 'root'
})
export class PopUpsService {

  constructor() { }

  /*
  Loading modal
  */

  private loadingModalDataSource: BehaviorSubject<ILoadingModalData> = new BehaviorSubject<ILoadingModalData>(null);
  loadingModalData$: Observable<ILoadingModalData> = this.loadingModalDataSource.asObservable();

  openLoadingModal(data: ILoadingModalData): void {
    this.loadingModalDataSource.next(data);
  }

  closeLoadingModal(): void {
    this.loadingModalDataSource.next(null);
  }

  /*
  Confirmation modal
  */

 private confirmationModalDataSource: BehaviorSubject<IConfirmationModalData> = new BehaviorSubject<IConfirmationModalData>(null);
 confirmationModalData$: Observable<IConfirmationModalData> = this.confirmationModalDataSource.asObservable();

 openConfirmationModal(data: IConfirmationModalData): void {
   this.confirmationModalDataSource.next(data);
 }

 closeConfirmationModal(): void {
   this.confirmationModalDataSource.next(null);
 }

  /*
  Snackbar
  */

  private snackbarDataSource: BehaviorSubject<ISnackbarData> = new BehaviorSubject<ISnackbarData>(null);
  snackbarData$: Observable<ISnackbarData> = this.snackbarDataSource.asObservable();

  showSnackbar(data: ISnackbarData): void {
    this.snackbarDataSource.next(data);
  }

  /*
  Other
  */

  handleApiError(err: HttpErrorResponse): void {
    console.log(err);
    const message: string = (err && err.error && err.error.message) || 'Neočekávaná chyba se vyskytla';
    this.showSnackbar({ message, type: SnackbarType.Error });
  }
}
