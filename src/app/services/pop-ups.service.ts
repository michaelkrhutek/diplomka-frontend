import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoadingModalData } from '../models/loading-modal-data';
import { ISnackbarData, SnackbarType } from '../models/snackbar-data';
import { HttpErrorResponse } from '@angular/common/http';

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
    const message: string = (err && err.error && err.error.message) || 'Chyba nastala';
    this.showSnackbar({ message, type: SnackbarType.Error });
  }
}
