import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";``
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/do";
import {NotificationsService} from "../notifications/notifications.service";

class Category {
  id: number;
  category: string;
  color: string;
}

class TypedCategory extends Category {
  type: string;
}

export class CategoriesResponse {
  user_id?: number;
  income_tracks?: Category[];
  cost_tracks?: Category[];
}

class DeletedCategory {
  id: number;
  type: string;
}

@Injectable()
export class UserCategoriesService {
  static categories: any;
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
      `http://localhost:8080/api/categories?id=${UserCategoriesService.userID}`
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

  public putNewCategory(type: string, category: string, color: string): void {
    this.http.put<Category>(
      'http://localhost:8080/api/category',
      { user_id: UserCategoriesService.userID, type, category, color }
    )
      .subscribe(
        (res: TypedCategory) => {
          const { type, id, category, color } = res;
          if (type === 'income') {
            this.addIncomeCategory(id, category, color);
          } else if (type === 'cost') {
            this.addCostCategory(id, category, color);
          }
          this.notifications.show('success', 'Success:', 'New category created!');
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.notifications.show('danger', 'Error: ', 'Couldn\'t create new category');
        }
      );
  }

  public deleteCategory(id: number, type: string): void {
    this.http.delete<DeletedCategory>(`http://localhost:8080/api/category?id=${id}&type=${type}`)
      .subscribe(
        (res: DeletedCategory) => {
          if (res.type === 'income') {
            this.deleteIncomeCategory(res.id);
          } else if (res.type === 'cost') {
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
    categories.income_categories = categories.income_categories.filter(({ id }) => deletedID !== id);
    categoriesPublisher.next(categories);
  }

  private deleteCostCategory(deletedID: number): void {
    const { categories, categoriesPublisher } = UserCategoriesService;
    categories.cost_categories = categories.cost_categories.filter(({ id }) => deletedID !== id);
    categoriesPublisher.next(categories);
  }

  private addIncomeCategory(id: number, category: string, color: string): void {
    const { categories, categoriesPublisher } = UserCategoriesService;
    categories.income_categories = categories.income_categories.concat({ id, category, color });
    categoriesPublisher.next(categories);
  }

  private addCostCategory(id: number, category: string, color: string): void {
    const { categories, categoriesPublisher } = UserCategoriesService;
    categories.income_cost = categories.cost_categories.concat({ id, category, color });
    categoriesPublisher.next(categories);
  }
}
