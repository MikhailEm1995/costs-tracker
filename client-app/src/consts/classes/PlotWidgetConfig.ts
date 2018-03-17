class PlotData {
  name: string;
  color: string;
  values: number[];
}

export default class PlotWidget {
  private element: string;
  private type: string;
  private period: string;
  private data: PlotData[];

  private types = ['line', 'pie', 'bar'];
  private periods = ['month', 'year'];

  constructor(
    element, type, period, data
  ) {
    this.element = element;
    this.type = this.validateInput(type, this.types);
    this.period = this.validateInput(period, this.periods);
    this.data = data;
  }

  private validateInput(input: any, acceptableValues: any[]): any {
    if (acceptableValues.includes(input)) {
      return input;
    }

    return acceptableValues[0];
  }

  public getConfig(): any {
    return {
      bindto: this.element,
      data: {
        columns: this.getColumns(),
        types: this.getTypes(),
        colors: this.getColors()
      },
      interaction: {
        enabled: false
      },
      axis: this.type !== 'pie' ? this.getAxis() : {}
    };
  }

  private getColumns(): any[] {
    return this.data.map(elem => [elem.name, ...elem.values]);
  }

  private getTypes(): any {
    const types = {};

    this.data.forEach((elem) => {
      types[elem.name] =
        (this.type === 'line' && this.period === 'month') ? 'area' :
        (this.type === 'line' && this.period === 'year') ? 'line' :
        (this.type === 'pie') ? 'pie' :
        (this.type === 'bar') ? 'bar' : 'line';
    });

    return types;
  }

  private getColors(): any {
    const colors = {};

    this.data.forEach((elem) => {
      colors[elem.name] = elem.color;
    });

    return colors;
  }

  private getAxis(): any {
    switch (this.period) {
      case 'month': return {};
      case 'year': return {
        x: {
          type: 'category',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      };
      default: return {};
    }
  }
}
