import _ from 'lodash';
import FileAdaptor from './classes/FileAdaptor';

export const findDiff = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const objectsKeys = obj1Keys.concat(_.difference(obj2Keys, obj1Keys));
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

const genDiff = (file1, file2) => {
  const first = new FileAdaptor(file1);
  const second = new FileAdaptor(file2);
  return `{\n${findDiff(first.getData(), second.getData())}}`;
};

export default genDiff;
