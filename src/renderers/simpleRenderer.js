import _ from 'lodash';

const step = times => ' '.repeat(times);

const valueToString = (value, offset) => {
  if (_.isArray(value) || !_.isObject(value)) {
    return value;
  }
  const astKeys = _.keys(value);
  return astKeys.reduce((acc, cur) => {
    if (_.isObject(value[cur])) {
      const toAddRecursive = `\n${step(offset)}  ${cur}: {${valueToString(value[cur], offset + 4)}\n${step(offset - 2)}`;
      return acc.concat(toAddRecursive);
    }
    const toAdd = `{\n${step(offset)}  ${cur}: ${value[cur]}\n${step(offset - 2)}}`;
    return acc.concat(toAdd);
  }, []);
};

const checkObject = {
  unchanged: (obj, value, off) => `\n${step(off)}  ${obj.key}: ${value}`,
  added: (obj, value, off) => `\n${step(off)}+ ${obj.key}: ${value}`,
  removed: (obj, value, off) => `\n${step(off)}- ${obj.key}: ${value}`,
  changed: (obj, value, off) => `\n${step(off)}+ ${obj.key}: ${value[1]}\n${step(off)}- ${obj.key}: ${value[0]}`,
  nestedObj: (obj, value, off, fn) => `\n${step(off)}  ${obj.key}: ${fn(obj.children, off + 4)}`,
};

const simpleRender = (ast, offset = 2) => {
  const result = _.flatten(ast.map((cur) => {
    const value = valueToString(cur.value, offset + 4);
    return checkObject[cur.type](cur, value, offset, simpleRender);
  }));
  return `{${result.join('')}\n${step(offset - 2)}}`;
};

export default simpleRender;
