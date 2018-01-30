import ini from 'ini';
import FileObj from './FileObj';

export default class IniObj extends FileObj {
  convertFile() {
    const file = this.getFile();
    return ini.parse(file);
  }
}
