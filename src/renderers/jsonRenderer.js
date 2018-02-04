
const render = ast => ast.reduce((acc, cur) => {
  switch (cur.type) {
    case 'nestedObj':
      return ({ ...acc, [cur.key]: { type: cur.type, value: render(cur.children) } });
    case 'changed':
      return {
        ...acc,
        [cur.key]:
          { type: cur.type, valueBefore: cur.valueBeforeChange, valueAfter: cur.valueAfterChange },
      };
    default:
      return { ...acc, [cur.key]: { type: cur.type, value: cur.value } };
  }
}, {});


const jsonRender = ast => JSON.stringify(render(ast));

export default jsonRender;
