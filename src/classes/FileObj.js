import fs from 'fs';

export default class FileObj {
  constructor(file) {
    this.file = file;
  }
  getFile() {
    return fs.readFileSync(this.file);
  }
}
