import plainRender from './plainRenderer';
import simpleRender from './simpleRenderer';

const render = (ast, renderMethod) => {
  switch (renderMethod) {
    case 'plain':
      return plainRender(ast);
    default:
      return simpleRender(ast);
  }
};

export default render;
