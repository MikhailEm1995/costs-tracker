import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  aWidget = {
    colsNumber: 2,
    watchConditions: true,
    vars: {
      cost: 500,
      income: 300
    },
    templates: {
      firstCol: ['Today\'s income is $#{income}', 'Income ($#{income}) is less than costs ($#{cost})!'],
      secondCol: ['Costs $#{cost} > Income $#{income}']
    },
    conditions: {
      success: ['#{income} > (#{cost} + 100)'],
      alarm: ['#{income} == #{cost}'],
      danger: ['#{income} < #{cost}']
    },
    isTextWatchForConditions: true,
    firstCol: {
      color: 'primary',
      align: 'center',
      size: 'h5'
    },
    secondCol: {
      color: '',
      align: 'right',
      size: 'h3'
    }
  };
  secondWidget = {
    colsNumber: 1,
    watchConditions: true,
    vars: {
      first: 146,
      second: 36728,
      third: 3278
    },
    templates: {
      firstCol: ['Whatever #{third}', 'Second var #{second}'],
      secondCol: ['This var must\'t be seen #{first}']
    },
    conditions: {
      success: ['#{third} > #{first}'],
      alarm: [],
      danger: []
    },
    isTextWatchForConditions: true,
    firstCol: {
      color: '',
      align: 'right',
      size: 'h5'
    },
    secondCol: {
      color: 'primary',
      align: 'right',
      size: 'h5'
    }
  };
  plotConfig = {
    type: 'line',
    period: 'month',
    data: [
      {
        name: 'Costs',
        color: 'red',
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      {
        name: 'Income',
        color: 'green',
        values: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
      }
      ]
  };
}
