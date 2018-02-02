import _ from 'lodash';
import ini from 'ini';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const makeAst = (data, keyName) => {
  const parentInfo = !keyName ? { type: 'root' } : { type: 'tree', key: keyName };
  return {
    ...parentInfo,
    children: Object.keys(data).map(item => (data[item] instanceof Object
      ? makeAst(data[item], item)
      : {
        type: 'leaf', key: item, value: data[item],
      })),
  };
};

const step = times => ' '.repeat(times);

const astToString = (ast, offset) => (ast.type === 'leaf'
  ? `${ast.key}: ${ast.value}`
  : ast.children.reduce(
    (acc, cur) => (cur.type === 'leaf'
      ? acc.concat(`\n${step(offset + 2)}${cur.key}: ${cur.value}`)
      : acc.concat(`\n${step(offset + 2)}${cur.key}: {${astToString(cur, offset + 2)}\n${step(offset)}}`))
    , '',
  ));

const findDiff = (ast1, ast2, offset = 2) => {
  const ast1Children = ast1.children.map(item => item.key);
  const ast2Children = ast2.children.map(item => item.key);
  const allChildren = _.union(ast1Children, ast2Children);
  return allChildren.reduce((acc, cur) => {
    const astObj1 = ast1.children.find(item => item.key === cur);
    const astObj2 = ast2.children.find(item => item.key === cur);
    if (!astObj1 || !astObj2) {
      const sign = astObj1 ? '-' : '+';
      const newAst = astObj1 || astObj2;
      return newAst.type === 'leaf'
        ? acc.concat(`\n${step(offset)}${sign} ${astToString(newAst, offset)}`)
        : acc.concat(`\n${step(offset)}${sign} ${newAst.key}: {${astToString(newAst, offset + 4)}\n${step(offset + 2)}}`);
    } else if (astObj1.type === 'leaf' || astObj2.type === 'leaf') {
      return astObj1.value !== astObj2.value
        ? acc.concat(`\n${step(offset)}+ ${astToString(astObj2, offset)}\n${step(offset)}- ${astToString(astObj1, offset)}`)
        : acc.concat(`\n${step(offset)}  ${astToString(astObj1, offset)}`);
    }
    return acc.concat(`\n${step(offset + 2)}${astObj1.key}: {${findDiff(astObj1, astObj2, offset + 4)}\n${step(offset + 2)}}`);
  }, '');
};

const getFileExt = (pathToFile) => {
  const base = path.basename(pathToFile);
  return path.extname(base).substring(1);
};

const parseAnyFormat = {
  json: JSON.parse,
  ini: ini.parse,
  yml: yaml.safeLoad,
};

const parse = (fileData, ext) => parseAnyFormat[ext](fileData);

const genDiff = (pathToFile1, pathToFile2) => {
  const ext1 = getFileExt(pathToFile1);
  const ext2 = getFileExt(pathToFile2);
  const data1 = fs.readFileSync(pathToFile1, 'utf-8');
  const data2 = fs.readFileSync(pathToFile2, 'utf-8');
  const ast1 = makeAst(parse(data1, ext1));
  const ast2 = makeAst(parse(data2, ext2));
  return `{${findDiff(ast1, ast2)}\n}`;
};

export default genDiff;
