import fs from 'fs';
import path from 'path';

export default class FileObj {
  constructor(file) {
    this.file = file;
  }
  getFile() {
    return fs.readFileSync(this.file, 'utf-8');
  }
  getExt() {
    const base = path.basename(this.file);
    return path.extname(base).substring(1);
  }
}
