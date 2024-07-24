import { FakeApiStore } from '~/fakeApi/fakeApiStore';
import { DataItem } from '~/fakeApi/types';
import { delay as delayFn } from '~/utils/delay';

const API_DELAY_EMULATION_TIME_IN_MS = 300;

const makeTestItem = (id: number, children: DataItem[]): DataItem => ({
  id: id.toString(),
  name: `data item ${id}`,
  sum: id * 100,
  count: id * 10,
  children,
});

const makeData = () => [
  makeTestItem(1, [makeTestItem(2, [])]),
  makeTestItem(3, [
    makeTestItem(4, [
      makeTestItem(7, [makeTestItem(8, [])]),
      makeTestItem(9, [makeTestItem(10, [])]),
      makeTestItem(11, [makeTestItem(12, [])]),
    ]),
  ]),
  makeTestItem(5, [makeTestItem(6, [])]),
];

export const API = new FakeApiStore({ data: makeData(), delay: () => delayFn(API_DELAY_EMULATION_TIME_IN_MS) });
