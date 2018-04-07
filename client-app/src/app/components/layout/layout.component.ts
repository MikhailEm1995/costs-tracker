import { Component } from '@angular/core';
import {NotificationsService, Notification} from "../../services/notifications/notifications.service";

class Alert {
  id: number;
  type: string;
  label?: string;
  message: string;
  timeout?: any;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  public alerts: Alert[] = [];

  constructor() {
    NotificationsService.message.subscribe((message: Notification) => {
      this.addAlert(message);
    });
  }

  private addAlert(message: Notification): void {
    let newAlertID = 0;
    this.alerts.forEach(({ id }) => {
      if (id > newAlertID) newAlertID = id + 1;
    });

    const newAlert: Alert = {
      id: newAlertID, type: message.type, label: message.label, message: message.message
    };

    this.alerts = [newAlert].concat(this.alerts);

    newAlert.timeout = setTimeout(() => {
      this.deleteAlert(newAlert);
    }, 5000);
  }

  public deleteAlert(alert: Alert): void {
    clearTimeout(alert.timeout);

    const index = this.alerts.indexOf(alert);

    if (index === -1) return;

    this.alerts = this.alerts.slice(0, index).concat(this.alerts.slice(index + 1));
  }
}
