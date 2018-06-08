import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {apiHost} from "../../../consts/config";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "../notifications/notifications.service";

@Injectable()
export class BalancesService {

  public static currentMonthBalances: Subject<any> = new Subject<any>();
  public static currentYearBalances: Subject<any> = new Subject<any>();
  public static previousMonthBalances: Subject<any> = new Subject<any>();
  public static previousYearBalances: Subject<any> = new Subject<any>();
  public static customPeriodBalances: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) { }

  getCurrentMonthBalances(user_id: string): void {
    this.http.get<any>(
      `${apiHost}/api/balances/month/current?id=${user_id}`
    )
      .subscribe(
        (res: any) => {
          BalancesService.currentMonthBalances.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get balances');
        }
      );
  }

  getCurrentYearBalances(user_id: string): void {
    this.http.get<any>(
      `${apiHost}/api/balances/month/current?id=${user_id}`
    )
      .subscribe(
        (res: any) => {
          BalancesService.currentYearBalances.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get balances');
        }
      );
  }

  getPreviousMonthBalances(user_id: string): void {
    this.http.get<any>(
      `${apiHost}/api/balances/month/current?id=${user_id}`
    )
      .subscribe(
        (res: any) => {
          BalancesService.previousMonthBalances.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get balances');
        }
      );
  }

  getPreviousYearBalances(user_id: string): void {
    this.http.get<any>(
      `${apiHost}/api/balances/month/current?id=${user_id}`
    )
      .subscribe(
        (res: any) => {
          BalancesService.previousYearBalances.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get balances');
        }
      );
  }

  getBalancesMonths(user_id: string, limit: number): void {
    this.http.get<any>(
      `${apiHost}/api/balances?id=${user_id}&limit=${limit}`
    )
      .subscribe(
        (res: any) => {
          BalancesService.customPeriodBalances.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get balances');
        }
      );
  }

  putAddToBalance(user_id: string, num: number, date: string): void {
    this.http.put<any>(
      `${apiHost}/api/balance/add`,
      { user_id, num, date }
    )
      .subscribe(
        (res: any) => {
          BalancesService.currentMonthBalances.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get balances');
        }
      );
  }

  putSubtractFromBalance(user_id: string, num: number, date: string): void {
    this.http.put<any>(
      `${apiHost}/api/balance/add`,
      { user_id, num, date }
    )
      .subscribe(
        (res: any) => {
          BalancesService.currentMonthBalances.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get balances');
        }
      );
  }
}
