import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from './shared/services/electron/electron.service';
import { MenuClickEvent } from '../../app/types/menu-click-event';
import { DataService } from './shared/services/data/data.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { StatisticsMessage } from './shared/types/statistics-message';
import { DataZoomService } from './shared/services/data-zoom/data-zoom.service';
import { parse } from 'csv-parse';
import { Router } from '@angular/router';
import { ParametersService } from './shared/services/parameters/parameters.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly statisticsDestroy$ = new Subject<void>();

  private statisticsWindow: Window | null = null;

  constructor(
    private electronService: ElectronService,
    private dataService: DataService,
    private dataZoomService: DataZoomService,
    private parametersService: ParametersService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    const { ipcRenderer } = this.electronService;

    if (ipcRenderer) {
      ipcRenderer.on(MenuClickEvent.OpenFile, (_, filePaths) => {
        this.ngZone.run(() => this.openFile(filePaths));
      });

      ipcRenderer.on(MenuClickEvent.Statistics, () => {
        this.ngZone.run(() => this.openStatistics());
      });
    }
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

  private openStatistics() {
    combineLatest([
      this.dataService.currentData$,
      this.parametersService.selectedParameters$,
      // this.dataZoomService.dataZoom$,
    ])
      .pipe(takeUntil(this.statisticsDestroy$))
      .subscribe(([data, parameters]) => {
        const message: StatisticsMessage = { data, parameters };

        if (!this.statisticsWindow) {
          this.statisticsWindow = window.open(
            './statistics',
            '_blank',
            'width=1400,height=500,autoHideMenuBar=true',
          );

          this.statisticsWindow.addEventListener('load', () => {
            this.postMessageToStatisticsWindow(message);

            this.statisticsWindow.addEventListener('beforeunload', () => {
              this.statisticsDestroy$.next();
              this.statisticsWindow = null;
            });
          });

          return;
        }

        this.postMessageToStatisticsWindow({ data, parameters });
      });
  }

  private postMessageToStatisticsWindow(message: StatisticsMessage) {
    this.statisticsWindow.postMessage(message);
  }
}
