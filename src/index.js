import _ from 'lodash';
import ini from 'ini';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const findDiff = (obj1, obj2) => {
  const objectsKeys = _.union(_.keys(obj1), _.keys(obj2));
  return objectsKeys.reduce((acc, cur) => {
    if (!obj1[cur]) {
      return acc.concat(`  + ${cur}: ${obj2[cur]}\n`);
    } else if (!obj2[cur]) {
      return acc.concat(`  - ${cur}: ${obj1[cur]}\n`);
    }
    const newAcc = obj1[cur] === obj2[cur]
      ? `    ${cur}: ${obj1[cur]}\n`
      : `  + ${cur}: ${obj2[cur]}\n  - ${cur}: ${obj1[cur]}\n`;
    return acc.concat(newAcc);
  }, '');
};

export const makeAst = (data, keyName = undefined) => {
  const parentInfo = !keyName ? { type: 'root', children: [] } : { type: 'tree', key: keyName, children: [] };
  return {
    ...parentInfo,
    children: Object.keys(data).map((item) => {
      if (data[item] instanceof Object) {
        return makeAst(data[item], item);
      }
      return ({
        type: 'leaf', key: item, value: data[item], children: [],
      });
    }),
  };
};

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
  return `{\n${findDiff(parse(data1, ext1), parse(data2, ext2))}}`;
};

export default genDiff;
