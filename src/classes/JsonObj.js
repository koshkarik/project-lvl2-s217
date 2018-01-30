import FileObj from './FileObj';

export default class JsonObj extends FileObj {
  convertFile() {
    const file = this.getFile();
    return JSON.parse(file);
  }
}
