import _ from 'lodash';

const plainRender = (ast, pathString = "'") => {
  const array = ast.reduce((acc, cur) => {
    const sign = typeof cur.value === 'string' ? "'" : '';
    const beforeChangeSign = typeof cur.valueBeforeChange === 'string' ? "'" : '';
    const afterChangeSign = typeof cur.valueBeforeChange === 'string' ? "'" : '';
    const value = _.isObject(cur.value) ? 'complex value' : `value: ${sign}${cur.value}${sign}`;
    const newPath = `${pathString}${cur.key}.`;
    switch (cur.type) {
      case 'changed':
        return acc.concat(`Property ${pathString}${cur.key}' was updated. From ${beforeChangeSign}${cur.valueBeforeChange}${beforeChangeSign} to ${afterChangeSign}${cur.valueAfterChange}${afterChangeSign}`);
      case 'removed':
        return acc.concat(`Property ${pathString}${cur.key}' was removed`);
      case 'added':
        return acc.concat(`Property ${pathString}${cur.key}' was added with ${value}`);
      case 'nestedObj':
        return acc.concat(plainRender(cur.children, newPath));
      default:
        return acc;
    }
  }, []);
  return array.join('\n');
};

export default plainRender;
