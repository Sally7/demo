import Clipboard from 'clipboard';

function buildTree(list) {
  console.log(list)
  let map = {};
  list.forEach(item => {
    if (!map[item.id]) {
      map[item.id] = item;
    }
  });

  list.forEach(item => {
    if (item.parentId !== 0) {
      map[item.parentId].children
          ? map[item.parentId].children.push(item)
          : (map[item.parentId].children = [item]);
    }
  });

  return list.filter(item => {
    if (item.parentId === item.id) {
      return item;
    }
  });
}

export default buildTree;