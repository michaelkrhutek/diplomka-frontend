import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { Observable } from 'rxjs';
import { ILoadingModalData } from 'src/app/models/loading-modal-data';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingModalComponent {

  constructor(
    private popUpsService: PopUpsService
  ) { }

  data$: Observable<ILoadingModalData> = this.popUpsService.loadingModalData$;
}
