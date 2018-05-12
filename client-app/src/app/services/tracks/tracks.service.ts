import { Injectable } from '@angular/core';
import {NotificationsService} from "../notifications/notifications.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class TracksService {
  static userID: number = 1;


  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) { }

  public putIncomeTrack(number: number, date: string, category_id: number): void {
    this.http.put(
      '/api/track/income',
      { user_id: TracksService.userID, number, date, category_id }
    )
      .subscribe(
        (res) => {
          this.notifications.show('success', 'Success: ', 'Data has been successfully sent');
        },
        (err) => {
          this.notifications.show('danger', 'Error: ', 'Couldn\'t send data');
          console.error(err);
        }
      );
  }

  public putCostTrack(number: number, date: string, category_id: number): void {
    this.http.put(
      '/api/track/cost',
      { user_id: TracksService.userID, number, date, category_id }
    )
      .subscribe(
        (res) => {
          this.notifications.show('success', 'Success: ', 'Data has been successfully sent');
        },
        (err) => {
          this.notifications.show('danger', 'Error: ', 'Couldn\'t send data');
          console.error(err);
        }
      );
  }

}
