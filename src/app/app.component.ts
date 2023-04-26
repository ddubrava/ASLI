import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { ElectronService } from './shared/services/electron/electron.service';
import { MenuClickEvent } from '../../app/types/menu-click-event';
import { DataService } from './shared/services/data/data.service';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  showStatisticsComponent = false;

  constructor(
    private electronService: ElectronService,
    private dataService: DataService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const { ipcRenderer } = this.electronService;

    if (ipcRenderer) {
      ipcRenderer.on(MenuClickEvent.OpenFile, (_, filePath) => {
        this.ngZone.run(() => this.openFile(filePath));
      });

      ipcRenderer.on(MenuClickEvent.Statistics, () => {
        this.ngZone.run(() => this.toggleStatisticsComponent());
      });
    }
  }

  onStatisticsCloseClick() {
    this.toggleStatisticsComponent();
  }

  private async openFile(filePath: string) {
    const content = this.electronService.fs.readFileSync(filePath, 'utf8');

    const records = Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
    });

    this.dataService.init(records.data);
    this.router.navigateByUrl('main');
  }

  private toggleStatisticsComponent() {
    if (this.dataService.dataInitiated) {
      this.showStatisticsComponent = !this.showStatisticsComponent;
      this.cdr.markForCheck();
    }
  }
}
