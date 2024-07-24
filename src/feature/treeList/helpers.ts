import { ListPosition, RowTreeNodeView } from './types';
import { DataItem } from '~/fakeApi/types';

export const makeRowTreeNodeViewList = (treeX: DataItem[]) => {
  const result: RowTreeNodeView[] = [];
  let deep = 0;

  const tree = treeX.slice();

  const runner = (tree: DataItem[], prevListPosition: ListPosition[]) => {
    tree.forEach(({ children, ...body }, index, arr) => {
      let listPosition: ListPosition = ListPosition.START;
      if (index < arr.length - 1 && index > 0) {
        listPosition = ListPosition.CENTER;
      }
      if (index === arr.length - 1) {
        listPosition = ListPosition.END;
      }
      if (arr.length > deep) {
        deep = arr.length;
      }
      const lastPrevPosition = prevListPosition[prevListPosition.length - 1];
      const prevListPositionClone = prevListPosition.slice();
      if (lastPrevPosition === ListPosition.END) {
        prevListPositionClone[prevListPosition.length - 1] = ListPosition.EMPTY;
      }
      if (lastPrevPosition === ListPosition.CENTER || lastPrevPosition === ListPosition.START) {
        prevListPositionClone[prevListPosition.length - 1] = ListPosition.BOUND;
      }

      const currentListPosition = [...prevListPositionClone, listPosition];
      result.push({ body, listPosition: currentListPosition });
      const actualChild = children.slice();

      runner(actualChild, currentListPosition);
    });
  };

  runner(tree, []);

  return { result, deep };
};
