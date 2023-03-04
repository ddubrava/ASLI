import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from './shared/services/electron/electron.service';
import { MenuClickEvent } from '../../app/types/menu-click-event';
import { ParametersService } from './shared/services/parameters/parameters.service';
import { DatasetService } from './shared/services/dataset/dataset.service';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { StatisticsMessage } from './shared/types/statistics-message';
import { DataZoomService } from './shared/services/data-zoom/data-zoom.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private statisticsWindow: Window | null = null;

  constructor(
    private electronService: ElectronService,
    private parametersService: ParametersService,
    private datasetService: DatasetService,
    private dataZoomService: DataZoomService,
  ) {}

  ngOnInit() {
    const { ipcRenderer } = this.electronService;

    if (ipcRenderer) {
      ipcRenderer.on(MenuClickEvent.Statistics, () => {
        this.openStatistics();
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private openStatistics() {
    /**
     * @todo handle case when window is opened and we need to update the table.
     *    and handle case when window is closed and we should ignore these values
     */
    combineLatest([this.parametersService.parameters$, this.dataZoomService.dataZoom$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([parameters, dataZoom]) => {
        const data = this.datasetService.getData(parameters, dataZoom);
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
