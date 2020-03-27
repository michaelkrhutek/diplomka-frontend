import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { PopUpsService } from 'src/app/services/pop-ups.service';
import { filter } from 'rxjs/operators';
import { ISnackbarData, SnackbarType } from 'src/app/models/snackbar-data';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarComponent implements OnInit {

  constructor(
    private popUpsService: PopUpsService
  ) { }

  private timeToClose: number = 4000;
  private timer: any;
  private subscription: Subscription;

  private dataSource: BehaviorSubject<ISnackbarData> = new BehaviorSubject<ISnackbarData>(null);
  data$: Observable<ISnackbarData> = this.dataSource.asObservable();

  ngOnInit(): void {
    this.popUpsService.snackbarData$.pipe(
      filter((data: ISnackbarData | null) => !!data)
    ).subscribe((data: ISnackbarData) => {
      clearTimeout(this.timer);
      this.dataSource.next(data);
      this.timer = setTimeout(() => this.dataSource.next(null), this.timeToClose)
    })
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

  getCssClassName(type: SnackbarType): string {
    switch (type) {
      case SnackbarType.Success:
        return 'snackbar success';
      case SnackbarType.Error:
        return 'snackbar error';
      default:
        return 'snackbar warning';
    }
  }
}
