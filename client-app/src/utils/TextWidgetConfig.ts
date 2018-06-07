class ColTemplates {
  firstCol: string[];
  secondCol: string[];
}

class ColConfig {
  color: string;
  align: string;
  size: string;
}

class Conditions {
  success: string[];
  alarm: string[];
  danger: string[];
}

class TextConfig {
  colsNumber: number;
  watchConditions: boolean;
  conditions: Conditions;
  isTextWatchForConditions: boolean;
  firstCol: ColConfig;
  secondCol: ColConfig;
}

export default class TextWidget {
  private vars: any;
  private templates: ColTemplates;
  private config: TextConfig;

  constructor(
    config: TextConfig
  ) {
    this.config = config;
  }

  public isWatchConditions(): boolean {
    const { watchConditions } = this.config;

    if (typeof watchConditions !== 'boolean') return false;

    return watchConditions;
  }

  public isTextWatchForConditions(): boolean {
    const { isTextWatchForConditions } = this.config;

    if (typeof isTextWatchForConditions !== 'boolean') return false;

    return isTextWatchForConditions;
  }

  public parseString(str, vars, handler = null): string {
    let result = str;
    const regex = /(#{[A-Za-z0-9]+})/g;
    const extractedVars = str.match(regex).map(elem => elem.slice(2, elem.length - 1));

    extractedVars.forEach((elem) => {
      const replacer = vars[elem] ?
        (handler ? handler(vars[elem]) : vars[elem]) :
        '???';

      result = result.replace(`#{${elem}}`, replacer);
    });

    return result;
  }

  public setTemplates(col, templates): TextWidget {
    if (!this.templates) {
      this.templates = new ColTemplates();
      this.templates.firstCol = [];
      this.templates.secondCol = [];
    }

    if (col === 1) {
      this.templates.firstCol = templates;
    } else if (this.config.colsNumber === 2) {
      this.templates.secondCol = templates;
    }

    return this;
  }

  public setVars(vars): TextWidget {
    this.vars = vars;

    return this;
  }

  public getTexts(handler): any {
    return [this.templates.firstCol, this.templates.secondCol].map((templates) => {
      return templates.map(template => this.parseString(template, this.vars, handler));
    });
  }

  public getVars(): any {
    return this.vars;
  }

  public getNumberOfCols(): number {
    const { colsNumber } = this.config;

    if (colsNumber > 2) return 2;

    return colsNumber;
  }

  public getFirstColConfig(): ColConfig {
    return this.config.firstCol;
  }

  public getSecondColConfig(): any {
    if (this.config.colsNumber !== 2) {
      return false;
    }

    return this.config.secondCol;
  }

  public getConditions(): Conditions {
    return this.config.conditions;
  }
}
