import plainRender from './plainRenderer';
import simpleRender from './simpleRenderer';
import jsonRender from './jsonRenderer';

export default (ast, renderMethod) => {
  switch (renderMethod) {
    case 'plain':
      return plainRender(ast);
    case 'json':
      return jsonRender(ast);
    default:
      return simpleRender(ast);
  }
};
