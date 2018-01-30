import ini from 'ini';
import yaml from 'js-yaml';
import FileObj from './FileObj';

const transrormAnyFormat = {
  json: file => JSON.parse(file),
  ini: file => ini.parse(file),
  yml: file => yaml.safeLoad(file),
};

export default class FileAdaptor {
  constructor(file) {
    this.file = new FileObj(file);
  }
  getData() {
    const ext = this.file.getExt();
    const fileData = this.file.getFile();
    return transrormAnyFormat[ext](fileData);
  }
}
