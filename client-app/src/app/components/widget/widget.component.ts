import {Component, Input, OnInit} from '@angular/core';
import TextWidget from "../../../consts/classes/TextWidgetConfig";

import * as math from 'mathjs';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit{

  @Input() title: string;
  @Input() type: string;
  @Input() config: any;

  firstColClassNames: string;
  secondColClassNames: string;

  textWidget: TextWidget;

  border = 'border-light';

  getWidgetState = (): string => {
    const textWidget = this.textWidget;
    const { success, alarm, danger } = textWidget.getConditions();

    const successBoolMap = success.map((condition) => {
      return math.eval(textWidget.parseString(condition, textWidget.vars));
    });
    const alarmBoolMap = alarm.map((condition) => {
      return math.eval(textWidget.parseString(condition, textWidget.vars));
    });
    const dangerBoolMap = danger.map((condition) => {
      return math.eval(textWidget.parseString(condition, textWidget.vars));
    });

    switch (true) {
      case dangerBoolMap.includes(true): return 'danger';
      case alarmBoolMap.includes(true): return 'alarm';
      case successBoolMap.includes(true): return 'success';
      default: return 'light';
    }
  }

  handleTextOutput(val): string {
    return `<span class="font-weight-bold">${val}</span>`;
  }

  setBorderColor(): void {
    this.border = !this.textWidget.isWatchConditions() ? 'border-light' : 'border-' + this.getWidgetState();
  }

  constructor() {}

  private colors = ['primary', 'secondary', 'success', 'danger', 'alarm', 'info', 'light', 'dark'];
  private sizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  private align = ['left', 'center', 'right'];

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

  ngOnInit() {
    if (this.type === 'text') {
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
    }

    this.setBorderColor();
  }
}
