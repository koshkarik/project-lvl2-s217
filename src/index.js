import _ from 'lodash';
import ini from 'ini';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import render from './renderers/';

const propertyActions = [
  {
    check: (obj1, obj2, key) => _.isObject(obj1[key]) && _.isObject(obj2[key]),
    attributes: (obj1, obj2, key, fn) => ({ type: 'nestedObj', key, children: fn(obj1[key], obj2[key]) }),
  }, {
    check: (obj1, obj2, key) => obj1[key] && !obj2[key],
    attributes: (obj1, obj2, key) => ({ type: 'removed', key, value: obj1[key] }),
  }, {
    check: (obj1, obj2, key) => !obj1[key] && obj2[key],
    attributes: (obj1, obj2, key) => ({ type: 'added', key, value: obj2[key] }),
  }, {
    check: (obj1, obj2, key) => obj1[key] === obj2[key],
    attributes: (obj1, obj2, key) => ({ type: 'unchanged', key, value: obj1[key] }),
  }, {
    check: (obj1, obj2, key) => obj1[key] !== obj2[key],
    attributes: (obj1, obj2, key) => ({
      type: 'changed', key, valueBeforeChange: obj1[key], valueAfterChange: obj2[key],
    }),
  },
];

const getAttributes = (object1, object2, key) =>
  _.find(propertyActions, ({ check }) => check(object1, object2, key));

export const genAst = (obj1, obj2) =>
  _.union(_.keys(obj1), _.keys(obj2))
    .map(cur => getAttributes(obj1, obj2, cur).attributes(obj1, obj2, cur, genAst));

// export const genAst = (obj1, obj2) => {
//   const unionOfKeys = _.union(Object.keys(obj1), Object.keys(obj2));
//   return unionOfKeys.map((cur) => {
//     if (_.isObject(obj1[cur]) && _.isObject(obj2[cur])) {
//       return ({ type: 'nestedObj', key: cur, children: genAst(obj1[cur], obj2[cur]) });
//     } else if (obj1[cur] && !obj2[cur]) {
//       return ({ type: 'removed', key: cur, value: obj1[cur] });
//     } else if (!obj1[cur] && obj2[cur]) {
//       return ({ type: 'added', key: cur, value: obj2[cur] });
//     } else if (obj1[cur] === obj2[cur]) {
//       return ({ type: 'unchanged', key: cur, value: obj1[cur] });
//     }
//     return ({
//       type: 'changed', key: cur, valueBeforeChange: obj1[cur], valueAfterChange: obj2[cur],
//     });
//   });
// };

const getFileExt = (pathToFile) => {
  const base = path.basename(pathToFile);
  return path.extname(base).substring(1);
};

const parseAnyFormat = {
  json: JSON.parse,
  ini: ini.parse,
  yml: yaml.safeLoad,
};

const parse = (fileData, ext) => parseAnyFormat[ext](fileData);

const genDiff = (pathToFile1, pathToFile2, renderMethod) => {
  const ext1 = getFileExt(pathToFile1);
  const ext2 = getFileExt(pathToFile2);
  const data1 = fs.readFileSync(pathToFile1, 'utf-8');
  const data2 = fs.readFileSync(pathToFile2, 'utf-8');
  const ast = genAst(parse(data1, ext1), parse(data2, ext2));
  return render(ast, renderMethod);
};

export default genDiff;
