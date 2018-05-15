import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/do";
import {NotificationsService} from "../notifications/notifications.service";

import {host} from "../../../consts/api";

class Category {
  id: number;
  name: string;
  color: string;
}

class TypedCategory extends Category {
  type: number;
}

export class CategoriesResponse {
  user_id?: number;
  income_tracks?: Category[];
  cost_tracks?: Category[];
}

class DeletedCategory {
  id: number;
  type: number;
}

@Injectable()
export class UserCategoriesService {
  static categories: any = {
    cost_categories: [],
    income_categories: []
  };
  static categoriesPublisher: Subject<CategoriesResponse> = new Subject();
  static userID: number = 1;

  constructor(
    private http: HttpClient,
    private notifications: NotificationsService
  ) {
    UserCategoriesService.categoriesPublisher.subscribe((categories: CategoriesResponse) => {
      UserCategoriesService.categories = categories;
    });
  }

  public getUserCategories(): void {
    this.http.get<CategoriesResponse>(
      `${host}/api/categories?id=${UserCategoriesService.userID}`
      )
      .subscribe(
        (res: CategoriesResponse) => {
          UserCategoriesService.categoriesPublisher.next(res);
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error:', 'Couldn\'t get categories');
        }
      );
  }

  public putNewCategory(type: number, name: string, color: string): void {
    this.http.put<TypedCategory>(
      `${host}/api/category`,
      { user_id: UserCategoriesService.userID, type, name, color }
    )
      .subscribe(
        (res: TypedCategory) => {
          const { type, id, name, color } = res;
          if (type === 2) {
            this.addIncomeCategory(id, name, color);
          } else if (type === 1) {
            this.addCostCategory(id, name, color);
          }
          this.notifications.show('success', 'Success:', 'New category created!');
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error: ', 'Couldn\'t create new category');
        }
      );
  }

  public deleteCategory(id: number, type: number): void {
    this.http.delete<DeletedCategory>(
      `${host}/api/category?id=${id}`,
      {
        withCredentials: false
      }
      )
      .subscribe(
        (res: DeletedCategory) => {
          if (type === 2) {
            this.deleteIncomeCategory(res.id);
          } else if (type === 1) {
            this.deleteCostCategory(res.id);
          }
          this.notifications.show('success', 'Success:', 'Category deleted!');
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error', 'Couldn\'t delete category');
        }
      );
  }

  private deleteIncomeCategory(deletedID: number): void {
    const { categories, categoriesPublisher } = UserCategoriesService;
    categories.income_categories = categories.income_categories.filter(({ id }) => +deletedID !== +id);
    categoriesPublisher.next(Object.assign({}, categories));
  }

  private deleteCostCategory(deletedID: number): void {
    const { categories, categoriesPublisher } = UserCategoriesService;
    categories.cost_categories = categories.cost_categories.filter(({ id }) => +deletedID !== +id);
    categoriesPublisher.next(Object.assign({}, categories));
  }

  private addIncomeCategory(id: number, name: string, color: string): void {
    const { categories, categoriesPublisher } = UserCategoriesService;
    categories.income_categories = categories.income_categories.concat({ id, name, color });
    categoriesPublisher.next(Object.assign({}, categories));
  }

  private addCostCategory(id: number, name: string, color: string): void {
    const { categories, categoriesPublisher } = UserCategoriesService;
    categories.cost_categories = categories.cost_categories.concat({ id, name, color });
    categoriesPublisher.next(Object.assign({}, categories));
  }
}
