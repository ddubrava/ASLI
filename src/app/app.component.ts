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
import { parse } from 'csv-parse';
import { Router } from '@angular/router';

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
      ipcRenderer.on(MenuClickEvent.OpenFile, (_, filePaths) => {
        this.ngZone.run(() => this.openFile(filePaths));
      });

      ipcRenderer.on(MenuClickEvent.Statistics, () => {
        this.ngZone.run(() => this.toggleStatisticsComponent());
      });
    }
  }

  onStatisticsCloseClick() {
    this.toggleStatisticsComponent();
  }

  private async openFile(filePaths: string[]) {
    const path = filePaths[0];
    const records = [];

    const parser = this.electronService.fs
      .createReadStream(path)
      .pipe(parse({ bom: true, delimiter: ';', columns: true, relax_column_count: true }));

    for await (const record of parser) {
      records.push(record);
    }

    this.dataService.init(records);
    this.router.navigateByUrl('main');
  }

  private toggleStatisticsComponent() {
    if (this.dataService.dataInitiated) {
      this.showStatisticsComponent = !this.showStatisticsComponent;
      this.cdr.markForCheck();
    }
  }
}
