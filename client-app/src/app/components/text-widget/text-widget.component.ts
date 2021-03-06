import {Component, Input, OnInit} from '@angular/core';
import TextWidget from '../../../utils/TextWidgetConfig';

import * as math from 'mathjs';

@Component({
  selector: 'app-text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.scss']
})
export class TextWidgetComponent implements OnInit {

  @Input() title: string;
  @Input() config: any;
  @Input() index: number;
  @Input('period') timePeriod: string;

  firstColClassNames: string;
  secondColClassNames: string;

  textWidget: TextWidget;

  border = 'border-light';

  private colors = ['primary', 'secondary', 'success', 'danger', 'alarm', 'info', 'light', 'dark'];
  private sizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  private align = ['left', 'center', 'right'];

  constructor() {}

  ngOnInit() {
    this.textWidget = new TextWidget({
      colsNumber: this.config.colsNumber,
      watchConditions: this.config.watchConditions,
      conditions: this.config.conditions,
      isTextWatchForConditions: this.config.isTextWatchForConditions,
      firstCol: this.config.firstCol,
      secondCol: this.config.secondCol
    });

    this.textWidget
      .setVars(this.config.vars)
      .setTemplates(1, this.config.templates.firstCol)
      .setTemplates(2, this.config.templates.secondCol);

    this.firstColClassNames = this.getFirstColClassNames();
    this.secondColClassNames = this.getSecondColClassNames();

    this.setBorderColor();

  }

  setBorderColor(): void {
    this.border = !this.textWidget.isWatchConditions() ? 'border-light' : 'border-' + this.getWidgetState();
  }

  getWidgetState = (): string => {
    const textWidget = this.textWidget;
    const { success, alarm, danger } = textWidget.getConditions();

    const successBoolMap = success.map((condition) => {
      return math.eval(textWidget.parseString(condition, textWidget.getVars()));
    });
    const alarmBoolMap = alarm.map((condition) => {
      return math.eval(textWidget.parseString(condition, textWidget.getVars()));
    });
    const dangerBoolMap = danger.map((condition) => {
      return math.eval(textWidget.parseString(condition, textWidget.getVars()));
    });

    switch (true) {
      case dangerBoolMap.includes(true): return 'danger';
      case alarmBoolMap.includes(true): return 'alarm';
      case successBoolMap.includes(true): return 'success';
      default: return 'light';
    }
  };

  getFirstColClassNames(): string {
    let { color, align, size } = this.textWidget.getFirstColConfig();

    if (!color && this.textWidget.isTextWatchForConditions()) {
      color = this.getWidgetState();
    }

    return `${this.colors.includes(color) ? 'text-' + color :
      'text-light'} ${this.align.includes(align) ? 'text-' + align :
      'text-left'} ${this.sizes.includes(size) ? size : 'h5'}`;
  }

  getSecondColClassNames(): string {
    if (this.textWidget.getNumberOfCols() !== 2) {
      return '';
    }

    let { color, align, size } = this.textWidget.getSecondColConfig();

    if (!color && this.textWidget.isTextWatchForConditions()) {
      color = this.getWidgetState();
    }

    return `${this.colors.includes(color) ? 'text-' + color :
      'text-light'} ${this.align.includes(align) ? 'text-' + align :
      'text-left'} ${this.sizes.includes(size) ? size : 'h5'}`;
  }

  handleTextOutput(val): string {
    return `<span class="font-weight-bold">${val}</span>`;
  }
}
