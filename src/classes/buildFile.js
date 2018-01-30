import path from 'path';
import JsonObj from './JsonObj';
import YmlObj from './YmlObj';

export default (file) => {
  const base = path.basename(file);
  const ext = path.extname(base);
  return ext === '.json' ? new JsonObj(file) : new YmlObj(file);
};
