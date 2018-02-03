import _ from 'lodash';
import ini from 'ini';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export const genAst = (obj1, obj2) => {
  const unionOfKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  return unionOfKeys.map((cur) => {
    if (_.isObject(obj1[cur]) && _.isObject(obj2[cur])) {
      return ({ type: 'nestedObj', key: cur, children: genAst(obj1[cur], obj2[cur]) });
    } else if (obj1[cur] && !obj2[cur]) {
      return ({ type: 'removed', key: cur, value: obj1[cur] });
    } else if (!obj1[cur] && obj2[cur]) {
      return ({ type: 'added', key: cur, value: obj2[cur] });
    } else if (obj1[cur] === obj2[cur]) {
      return ({ type: 'unchanged', key: cur, value: obj1[cur] });
    }
    return ({
      type: 'changed', key: cur, valueBeforeChange: obj1[cur], valueAfterChange: obj2[cur],
    });
  });
};

const step = times => ' '.repeat(times);

const toString = (ast, offset) => {
  const keys = Object.keys(ast);
  return keys.reduce((acc, cur) => (_.isObject(ast[cur])
    ? acc.concat(`\n${step(offset)}  ${cur}: {${toString(ast[cur], offset + 4)}\n${step(offset - 2)}`)
    : acc.concat(`{\n${step(offset)}  ${cur}: ${ast[cur]}\n${step(offset - 2)}}`)), '');
};

const findDiff = (ast, offset = 2) => ast.reduce((acc, cur) => {
  const value = _.isObject(cur.value) ? toString(cur.value, offset + 4) : cur.value;
  if (cur.type === 'unchanged') {
    return acc.concat(`\n${step(offset)}  ${cur.key}: ${value}`);
  } else if (cur.type === 'changed') {
    return acc.concat(`\n${step(offset)}+ ${cur.key}: ${cur.valueAfterChange}\n${step(offset)}- ${cur.key}: ${cur.valueBeforeChange}`);
  } else if (cur.type === 'added') {
    return acc.concat(`\n${step(offset)}+ ${cur.key}: ${value}`);
  } else if (cur.type === 'removed') {
    return acc.concat(`\n${step(offset)}- ${cur.key}: ${value}`);
  }
  return acc.concat(`\n${step(offset)}  ${cur.key}: {${findDiff(cur.children, offset + 4)}\n${step(offset + 2)}}`);
}, '');


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

const genDiff = (pathToFile1, pathToFile2) => {
  const ext1 = getFileExt(pathToFile1);
  const ext2 = getFileExt(pathToFile2);
  const data1 = fs.readFileSync(pathToFile1, 'utf-8');
  const data2 = fs.readFileSync(pathToFile2, 'utf-8');
  const ast = genAst(parse(data1, ext1), parse(data2, ext2));
  return `{${findDiff(ast)}\n}`;
};

export default genDiff;
