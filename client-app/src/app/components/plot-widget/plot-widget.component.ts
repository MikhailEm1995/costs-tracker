import {AfterViewInit, Component, Input} from '@angular/core';
import PlotWidget from '../../../consts/classes/PlotWidgetConfig';

import * as c3 from 'c3';

@Component({
  selector: 'app-plot-widget',
  templateUrl: './plot-widget.component.html',
  styleUrls: ['./plot-widget.component.scss']
})
export class PlotWidgetComponent implements AfterViewInit {

  @Input() title: string;
  @Input() config: any;
  @Input() index: number;
  @Input('period') timePeriod: string;

  ngAfterViewInit() {
    const plotConfig = new PlotWidget('#plot-' + this.index, this.config.type, this.config.period, this.config.data).getConfig();

    c3.generate(plotConfig);
  }
}
