import _ from 'lodash';
import buildFile from '../classes/buildFile';

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

export default class FileComparator {
  constructor(file1, file2) {
    this.fileObj1 = buildFile(file1);
    this.fileObj2 = buildFile(file2);
  }
  genDiff() {
    const first = this.fileObj1.convertFile();
    const second = this.fileObj2.convertFile();
    return `{\n${findDiff(first, second)}}`;
  }
}
