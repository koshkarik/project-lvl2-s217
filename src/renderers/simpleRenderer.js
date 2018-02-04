import _ from 'lodash';

const step = times => ' '.repeat(times);

const objToString = (ast, offset) => {
  const keys = Object.keys(ast);
  return keys.reduce((acc, cur) => (_.isObject(ast[cur])
    ? acc.concat(`\n${step(offset)}  ${cur}: {${objToString(ast[cur], offset + 4)}\n${step(offset - 2)}`)
    : acc.concat(`{\n${step(offset)}  ${cur}: ${ast[cur]}\n${step(offset - 2)}}`)), []);
};

const checkSign = (type) => {
  switch (type) {
    case 'added':
      return '+ ';
    case 'removed':
      return '- ';
    default:
      return '  ';
  }
};

const checkObject = [
  {
    types: ['unchanged', 'added', 'removed'],
    makeString: (obj, value, off) => `\n${step(off)}${checkSign(obj.type)}${obj.key}: ${value}`,
  }, {
    types: ['changed'],
    makeString: (obj, value, off) =>
      `\n${step(off)}+ ${obj.key}: ${obj.valueAfterChange}\n${step(off)}- ${obj.key}: ${obj.valueBeforeChange}`,
  }, {
    types: ['nestedObj'],
    makeString: (obj, value, off, fn) =>
      `\n${step(off)}${checkSign(obj.type)}${obj.key}: ${fn(obj.children, off + 4)}`,
  },
];

const getRightObj = checkType => _.find(checkObject, ({ types }) => types.includes(checkType));

const simpleRender = (ast, offset = 2) => {
  const result = ast.reduce((acc, cur) => {
    const value = _.isObject(cur.value) ? objToString(cur.value, offset + 4) : cur.value;
    const nodeString = getRightObj(cur.type);
    return acc.concat(nodeString.makeString(cur, value, offset, simpleRender));
  }, []);
  return `{${result.join('')}\n${step(offset - 2)}}`;
};

export default simpleRender;
