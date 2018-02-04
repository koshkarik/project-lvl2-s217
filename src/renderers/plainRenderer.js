import _ from 'lodash';

const stringify = val => (typeof val === 'string' ? `'${val}'` : val);

const getVal = val => (_.isObject(val) ? 'complex value' : `value: ${stringify(val)}`);

const plainRender = (ast, pathString = '') => {
  const array = ast.reduce((acc, cur) => {
    const newPath = `${pathString}${cur.key}.`;
    switch (cur.type) {
      case 'changed':
        return acc.concat(`Property '${pathString}${cur.key}' was updated. From ${stringify(cur.valueBeforeChange)} to ${stringify(cur.valueAfterChange)}`);
      case 'removed':
        return acc.concat(`Property '${pathString}${cur.key}' was removed`);
      case 'added':
        return acc.concat(`Property '${pathString}${cur.key}' was added with ${getVal(cur.value)}`);
      case 'nestedObj':
        return acc.concat(plainRender(cur.children, newPath));
      default:
        return acc;
    }
  }, []);
  return array.join('\n');
};

export default plainRender;
