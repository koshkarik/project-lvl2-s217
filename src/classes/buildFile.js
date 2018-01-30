import path from 'path';
import JsonObj from './JsonObj';
import YmlObj from './YmlObj';
import IniObj from './IniObj';

const decideObj = {
  json: file => new JsonObj(file),
  yml: file => new YmlObj(file),
  ini: file => new IniObj(file),
};

export default (file) => {
  const base = path.basename(file);
  const ext = path.extname(base).substring(1);
  return decideObj[ext](file);
};
