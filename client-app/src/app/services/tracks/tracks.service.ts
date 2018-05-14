import { Injectable } from '@angular/core';
import {NotificationsService} from "../notifications/notifications.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

class Track {
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
      `/api/tracks/month?id=${TracksService.userID}`
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
      `/api/tracks/year?id=${TracksService.userID}`
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
