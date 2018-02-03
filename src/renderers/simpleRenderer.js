import _ from 'lodash';

const step = times => ' '.repeat(times);

const objToString = (ast, offset) => {
  const keys = Object.keys(ast);
  return keys.reduce((acc, cur) => (_.isObject(ast[cur])
    ? acc.concat(`\n${step(offset)}  ${cur}: {${objToString(ast[cur], offset + 4)}\n${step(offset - 2)}`)
    : acc.concat(`{\n${step(offset)}  ${cur}: ${ast[cur]}\n${step(offset - 2)}}`)), []);
};

const simpleRender = (ast, offset = 2) => {
  const result = ast.reduce((acc, cur) => {
    const value = _.isObject(cur.value) ? objToString(cur.value, offset + 4) : cur.value;
    if (cur.type === 'unchanged') {
      return acc.concat(`\n${step(offset)}  ${cur.key}: ${value}`);
    } else if (cur.type === 'changed') {
      return acc.concat(`\n${step(offset)}+ ${cur.key}: ${cur.valueAfterChange}\n${step(offset)}- ${cur.key}: ${cur.valueBeforeChange}`);
    } else if (cur.type === 'added') {
      return acc.concat(`\n${step(offset)}+ ${cur.key}: ${value}`);
    } else if (cur.type === 'removed') {
      return acc.concat(`\n${step(offset)}- ${cur.key}: ${value}`);
    }
    return acc.concat(`\n${step(offset)}  ${cur.key}: ${simpleRender(cur.children, offset + 4)}`);
  }, []);
  return `{${result.join('')}\n${step(offset - 2)}}`;
};

export default simpleRender;
