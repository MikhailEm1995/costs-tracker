import {Component, Input, OnInit, AfterViewInit} from '@angular/core';
import TextWidget from '../../../consts/classes/TextWidgetConfig';
import PlotWidget from '../../../consts/classes/PlotWidgetConfig';

import * as math from 'mathjs';
import * as c3 from 'c3';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit, AfterViewInit {

  @Input() title: string;
  @Input() type: string;
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

  ngAfterViewInit() {
    if (this.type === 'plot') {
      const plotConfig = new PlotWidget('#plot-' + this.index, this.config.type, this.config.period, this.config.data).getConfig();

      c3.generate(plotConfig);
    }
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

      this.setBorderColor();
    }
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
