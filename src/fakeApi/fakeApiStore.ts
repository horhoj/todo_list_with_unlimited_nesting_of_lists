import { DataBodyItem, DataItem, FakeApiStoreContract } from './types';

export class FakeApiStore implements FakeApiStoreContract {
  private data: DataItem[] = [];
  private delay: () => Promise<void>;

  public constructor(payload: { data: DataItem[]; delay: () => Promise<void> }) {
    this.data = payload.data;
    this.delay = payload.delay;
  }

  public async getDataList() {
    await this.delay();
    return this.data;
  }

  public async getItem(id: string): Promise<DataItem | null> {
    await this.delay();
    const stack = [...this.data];

    while (stack.length > 0) {
      const current = stack.shift();
      if (current !== undefined) {
        if (current.id === id) {
          return current;
        }
        stack.unshift(...current.children);
      }
    }

    return null;
  }

  public async patchItem(id: string, body: DataBodyItem): Promise<DataItem | null> {
    await this.delay();
    const stack = [...this.data];

    while (stack.length > 0) {
      const current = stack.shift();
      if (current !== undefined) {
        if (current.id === id) {
          current.name = body.name;
          current.count = body.count;
          current.sum = body.sum;
          return current;
        }
        stack.unshift(...current.children);
      }
    }

    return null;
  }

  public async deleteItem(id: string): Promise<boolean> {
    await this.delay();
    interface StackItem {
      parent: DataItem[];
      indexInParent: number;
      dataItem: DataItem;
    }

    const stack: StackItem[] = this.data.map((el, i, arr) => ({ parent: arr, indexInParent: i, dataItem: el }));

    while (stack.length > 0) {
      const current = stack.shift();
      if (current !== undefined) {
        if (current.dataItem.id === id) {
          current.parent.splice(current.indexInParent, 1);
          return true;
        }
        stack.unshift(
          ...current.dataItem.children.map((el, i, arr) => ({ parent: arr, indexInParent: i, dataItem: el })),
        );
      }
    }

    return false;
  }
}
