import yaml from 'js-yaml';
import FileObj from './FileObj';

export default class YmlObj extends FileObj {
  convertFile() {
    const file = this.getFile();
    return yaml.safeLoad(file);
  }
}

