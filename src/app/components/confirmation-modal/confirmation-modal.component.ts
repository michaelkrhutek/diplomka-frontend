import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { Observable } from 'rxjs';
import { IConfirmationModalData } from 'src/app/models/confirmation-modal-data';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent {

  constructor(
    private popUpsService: PopUpsService
  ) { }

  data$: Observable<IConfirmationModalData> = this.popUpsService.confirmationModalData$;

  closeModal(): void {
    this.popUpsService.closeConfirmationModal();
  }

  actionConfirmed(action: () => void): void {
    action && action();
    this.closeModal();
  }
}
