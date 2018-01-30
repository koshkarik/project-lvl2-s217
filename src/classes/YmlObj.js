import fs from 'fs';
import yaml from 'js-yaml';
import FileObj from './FileObj';

export default class YmlObj extends FileObj {
  convertFile() {
    const file = fs.readFileSync(this.getFile());
    return yaml.safeLoad(file);
  }
}

