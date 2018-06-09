export const compose = (...fns) => val => fns.reduce((acc, fn) => fn(acc), val);
export const identity = (val = undefined) => ({ map: fn => identity(fn(val)), valueOf: val });
export const isStr = str => typeof str === 'string' ? str : '';
