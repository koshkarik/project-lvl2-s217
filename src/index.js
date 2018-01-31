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

const getFileExt = (file) => {
  const base = path.basename(file);
  return path.extname(base).substring(1);
};

const parseAnyFormat = {
  json: file => JSON.parse(file),
  ini: file => ini.parse(file),
  yml: file => yaml.safeLoad(file),
};

const parse = (file) => {
  const fileData = fs.readFileSync(file, 'utf-8');
  const ext = getFileExt(file);
  return parseAnyFormat[ext](fileData);
};

const genDiff = (file1, file2) => {
  const parsedFile1 = parse(file1);
  const parsedFile2 = parse(file2);
  return `{\n${findDiff(parsedFile1, parsedFile2)}}`;
};

export default genDiff;
