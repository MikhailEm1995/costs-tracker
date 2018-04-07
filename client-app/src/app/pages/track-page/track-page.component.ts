import {Component, OnInit} from '@angular/core';
import {CategoryStruct, DateStruct, TrackDataStruct} from "../../../consts/classes/trackPageClasses";
import {CategoriesResponse, UserCategoriesService} from "../../services/user-categories/user-categories.service";
import {HttpResponse} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {NotificationsService} from "../../services/notifications/notifications.service";

@Component({
  selector: 'app-track-page',
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.scss']
})
export class TrackPageComponent implements OnInit {

  trackModel = new TrackDataStruct();

  currentCategories: any;
  currentCategoriesType: boolean = false;

  newCategory = { id: 0, category: '', color: '' };
  now: Date = new Date();

  constructor(
    private userCategories: UserCategoriesService,
    private notifications: NotificationsService
  ) {
    UserCategoriesService.categoriesPublisher.subscribe((categories: CategoriesResponse) => {
          this.changeCurrentCategories(categories);
    });
  }

  ngOnInit() {
    this.userCategories.getUserCategories();
  }

  private changeCategoriesType(): void {
    this.currentCategoriesType = !this.currentCategoriesType;
  }

  private changeCurrentCategories(categories): void {
    if (this.currentCategoriesType) this.currentCategories = categories.income_categories;
    if (!this.currentCategoriesType) this.currentCategories = categories.cost_categories;
  }

  public handleCategoryTypeClick(): void {
    this.changeCategoriesType();
    this.changeCurrentCategories(UserCategoriesService.categories);
  }

  public handleCategoryClick({ target: { value } }): void {
    this.trackModel.category = this.currentCategories.find(({ id }) => id === value);
  }

  public handleDeleteCategoryClick(categoryID): void {
    this.userCategories.deleteCategory(categoryID, this.currentCategoriesType? 'income' : 'cost');
  }

  public handleAddNewCategoryClick(): void {
    this.userCategories.putNewCategory(
      this.currentCategoriesType? 'income' : 'cost',
      this.newCategory.category,
      this.newCategory.color);
  }

  public handleSetTodayClick(): void {
    if (!this.trackModel.date) this.trackModel.date = new DateStruct();

    const { date } = this.trackModel;

    date.day = this.now.getDate();
    date.month = this.now.getMonth() + 1;
    date.year = this.now.getFullYear();
  }

  sendIncome(): void {

  }

  sendCost(): void {

  }
}
