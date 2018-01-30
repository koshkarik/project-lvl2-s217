import fs from 'fs';
import FileObj from './FileObj';

export default class JsonObj extends FileObj {
  convertFile() {
    const file = fs.readFileSync(this.getFile());
    return JSON.parse(file);
  }
}
