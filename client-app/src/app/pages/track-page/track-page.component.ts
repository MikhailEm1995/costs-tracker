import {Component, OnInit} from '@angular/core';
import {DateStruct, TrackDataStruct} from "../../../consts/classes/trackPageClasses";
import {CategoriesResponse, UserCategoriesService} from "../../services/user-categories/user-categories.service";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {TracksService} from "../../services/tracks/tracks.service";

import * as moment from 'moment';

@Component({
  selector: 'app-track-page',
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.scss']
})
export class TrackPageComponent implements OnInit {

  trackModel = new TrackDataStruct();

  currentCategories: any;
  currentCategoriesType: boolean = false;

  newCategory = { id: 0, name: '', color: '#000000' };
  now: Date = new Date();

  constructor(
    private userCategories: UserCategoriesService,
    private tracks: TracksService,
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
    debugger;
    if (categories && this.currentCategoriesType) this.currentCategories = categories.income_categories;
    if (categories && !this.currentCategoriesType) this.currentCategories = categories.cost_categories;
  }

  public handleCategoryTypeClick(): void {
    this.changeCategoriesType();
    this.changeCurrentCategories(UserCategoriesService.categories);
  }

  public handleCategoryClick({ target: { value } }): void {
    this.trackModel.category_id = this.currentCategories.find(({ id }) => id === +value).id;
  }

  public handleDeleteCategoryClick(categoryID): void {
    this.userCategories.deleteCategory(categoryID, this.currentCategoriesType? 2 : 1);
  }

  public handleAddNewCategoryClick(): void {
    this.userCategories.putNewCategory(
      this.currentCategoriesType? 2 : 1,
      this.newCategory.name,
      this.newCategory.color);
  }

  public handleSetTodayClick(): void {
    if (!this.trackModel.date) this.trackModel.date = new DateStruct();

    const { date } = this.trackModel;

    date.day = this.now.getDate();
    date.month = this.now.getMonth() + 1;
    date.year = this.now.getFullYear();
  }

  public handleIncomeButtonClick(): void {
    const { number, category_id, date: { day, month, year } } = this.trackModel;
    const formattedDate = moment().set('year', year).set('month', month).set('date', day).format('YYYY-MM-DD');

    this.tracks.putIncomeTrack(number, formattedDate, category_id);
  }

  public handleCostButtonClick(): void {
    const { number, category_id, date: { day, month, year } } = this.trackModel;
    const formattedDate = moment().set('year', year).set('month', month).set('date', day).format('YYYY-MM-DD');

    this.tracks.putCostTrack(number, formattedDate, category_id);
  }
}
