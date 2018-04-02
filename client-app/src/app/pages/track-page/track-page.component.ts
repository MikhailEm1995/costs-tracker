import {Component, OnInit} from '@angular/core';
import {CategoryStruct, DateStruct, TrackDataStruct} from "../../../consts/classes/trackPageClasses";

@Component({
  selector: 'app-track-page',
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.scss']
})
export class TrackPageComponent implements OnInit {

  trackModel = new TrackDataStruct();

  categories: CategoryStruct[];
  newCategory: CategoryStruct = { name: '', color: '' };
  now: Date = new Date();

  day: number;
  month: number;
  year: number;

  constructor() { }

  ngOnInit() {
  //  TODO: get a list of user's categories

    this.categories = [
      { name: 'Meal', color: '#fff' },
      { name: 'Transport', color: '#000' },
      { name: 'Rest', color: '#ccc' },
      { name: 'Test', color: '#f00' }
    ];
  }

  chooseCategory({ target: { value } }): void {
    this.trackModel.category = this.categories.find(cat => cat.name === value);
  }

  addNewCategoryName(e): void {
    this.newCategory.name = e.target.value;
  }

  addNewCategoryColor(e): void {
    this.newCategory.color = e.target.value;
  }

  pushNewCategory(): void {
    const isCategoryExist = this.categories.some(({ name, color }) => {
      return name === this.newCategory.name && color === this.newCategory.color;
    });

    if (!isCategoryExist) this.categories.push(this.newCategory);

    console.log(this.categories);
  }

  unshiftCategory(catName): void {
    this.categories = this.categories.filter(({ name }) => {
      return name !== catName;
    });
  }

  setDay(e): void {
    this.day = e.target.value;
    this.trackModel.date.day = e.target.value;
  }

  setMonth(e): void {
    this.month = e.target.value;
    this.trackModel.date.month = e.target.value;
  }

  setYear(e): void {
    this.year = e.target.value;
    this.trackModel.date.year = e.target.value;
  }

  setToday(): void {
    if (!this.trackModel.date) this.trackModel.date = new DateStruct();

    const { date } = this.trackModel;

    date.day = this.now.getDate();
    date.month = this.now.getMonth() + 1;
    date.year = this.now.getFullYear();

    this.day = date.day;
    this.month = date.month;
    this.year = date.year;
  }

  sendIncome(): void {

  }

  sendOutcome(): void {
    
  }
}
