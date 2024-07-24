import { DataItem } from '~/fakeApi/types';

export enum ListPosition {
  START = '+',
  END = '-',
  CENTER = '>',
  EMPTY = '#',
  BOUND = '|',
}

export type RowTreeNodeBody = Omit<DataItem, 'children'>;

export interface RowTreeNodeView {
  body: RowTreeNodeBody;
  listPosition: ListPosition[];
}
