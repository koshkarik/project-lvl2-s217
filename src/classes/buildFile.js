import path from 'path';
import JsonObj from './JsonObj';
import YmlObj from './YmlObj';

const decideObj = {
  json: file => new JsonObj(file),
  yml: file => new YmlObj(file),
};

export default (file) => {
  const base = path.basename(file);
  const ext = path.extname(base).substring(1);
  return decideObj[ext](file);
};
