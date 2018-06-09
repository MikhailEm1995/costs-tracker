import {compose, identity, isStr} from './functions';

const matchKey = (key, str) => (() => identity())()
  .map(() => str.match(new RegExp(`${key}:[^;}]+`)))
  .map(res => res ? res : []);

const extract = key => ({ model, ...rest }) => ({ model, [key]: isStr(matchKey(key, model).valueOf[0]).split(':')[1], ...rest });
const extractModels = str => str.match(/#[A-Z]+?{(.)+?}/g);
const extractOperation = ({ model, ...rest }) =>
  ({ model, operation: model.match(/(VAR|SUM|SUBT|MULT|DIV|MOD|MAX)/)[0], ...rest });

const getConfig = compose(
  extractOperation,
  extract('data'),
  extract('period'),
  extract('from'),
  extract('to'),
  extract('category'),
  extract('varname')
);

export const parseTemplate = template => ({ template, models: extractModels(template).map(model => getConfig({ model })) });
export const parseTemplates = templates => templates.map(parseTemplate);
