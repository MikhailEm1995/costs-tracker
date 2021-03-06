import { Injectable } from '@angular/core';
import {NotificationsService} from "../notifications/notifications.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

import {apiHost} from "../../../consts/config";

class Track {
  id: number;
  number: number;
  date: string;
  type: number;
  category_id: number;
}

@Injectable()
export class TracksService {
  static userID: number = 1;
  static tracks: Subject<Track[]> = new Subject();

  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {}

  public getMonthTracks(): void {
    this.http.get<Track[]>(
      `${apiHost}/api/tracks/month?id=${TracksService.userID}`
    )
      .subscribe(
        (res: Track[]) => {
          TracksService.tracks.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get tracks');
        }
      );
  }

  public getYearTracks(): void {
    this.http.get<Track[]>(
      `${apiHost}/api/tracks/year?id=${TracksService.userID}`
    )
      .subscribe(
        (res: Track[]) => {
          TracksService.tracks.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get tracks');
        }
      );
  }

  public putIncomeTrack(number: number, date: string, category_id: number, comment: string): void {
    const body = comment === undefined ?
      { user_id: TracksService.userID, number, date, category_id } :
      { user_id: TracksService.userID, number, date, category_id, comment };

    this.http.put(`${apiHost}/api/track/income`, body)
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

  public putCostTrack(number: number, date: string, category_id: number, comment: string): void {
    const body = comment === undefined ?
      { user_id: TracksService.userID, number, date, category_id } :
      { user_id: TracksService.userID, number, date, category_id, comment };

    this.http.put(`${apiHost}/api/track/cost`, body)
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
