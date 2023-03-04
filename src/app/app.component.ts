import { Component } from '@angular/core';
import { ElectronService } from './shared/services/electron/electron.service';
import { MenuEvent } from '../../app/types/menu-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private electronService: ElectronService) {
    electronService.ipcRenderer?.on(MenuEvent.OpenStatistics, () => {
      window.open('/');
    });
  }
}
