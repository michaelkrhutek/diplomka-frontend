import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent {

  constructor() { }

  @Input() headingText: string;
  @Input() iconName: string;
}
