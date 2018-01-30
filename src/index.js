import FileComparator from './classes/FileComparator';

const genDiff = (file1, file2) => {
  const comparator = new FileComparator(file1, file2);
  return comparator.genDiff();
};

export default genDiff;
