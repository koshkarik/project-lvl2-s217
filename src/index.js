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

const genDiff = (...pathToFiles) => {
  const filesData = pathToFiles.map((filePath) => {
    const extension = getFileExt(filePath);
    const data = fs.readFileSync(filePath, 'utf-8');
    return parse(data, extension);
  });
  return `{\n${findDiff(...filesData)}}`;
};

export default genDiff;
