import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataService } from '../../shared/services/data/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  allData$ = this.dataService.allData$;

  constructor(private dataService: DataService) {}
}
