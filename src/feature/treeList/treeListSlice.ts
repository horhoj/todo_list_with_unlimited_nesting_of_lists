import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeRowTreeNodeViewList } from './helpers';
import { CreateItemId } from './types';
import { makeRequestExtraReducer, makeRequestStateProperty, RequestList, RequestStateProperty } from '~/store/helpers';
import { API } from '~/api/api';
import { getApiErrors } from '~/api/common';
import { RootState } from '~/store/types';
import { DataBodyItem, DataItem } from '~/fakeApi/types';

const SLICE_NAME = 'treeList';

interface IS {
  fetchDataRequest: RequestStateProperty<DataItem[]>;
  addDataItemRequest: RequestStateProperty;
  createItemId: CreateItemId | null;
}

const initialState: IS = {
  fetchDataRequest: makeRequestStateProperty(),
  addDataItemRequest: makeRequestStateProperty(),
  createItemId: null,
};

const { actions, reducer, selectors } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
    setCreateItemId: (state, action: PayloadAction<CreateItemId | null>) => {
      state.createItemId = action.payload;
    },
    addCreatedItem: (state, action: PayloadAction<{ id: string; body: DataBodyItem; parentId: string | null }>) => {
      if (state.fetchDataRequest.data === null) {
        return;
      }
      const { body, id, parentId } = action.payload;
      if (parentId === null) {
        state.fetchDataRequest.data.push({ id, ...body, children: [] });
      }
      const stack = [...state.fetchDataRequest.data];
      while (stack.length > 0) {
        const current = stack.shift();
        if (current !== undefined) {
          if (current.id === parentId) {
            current.children.push({ id, ...body, children: [] });
            break;
          }
          stack.unshift(...current.children);
        }
      }

      state.createItemId = null;
    },
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, fetchDataRequestThunk, 'fetchDataRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, addDataItemRequestThunk, 'addDataItemRequest');
  },
});

const fetchDataRequestThunk = createAsyncThunk(`SLICE_NAME/fetchCommentsThunk`, async (_, store) => {
  try {
    const res = await API.getDataList();
    return store.fulfillWithValue(res);
  } catch (e: unknown) {
    return store.rejectWithValue(getApiErrors(e));
  }
});

interface AddDataItemRequestThunkPayload {
  parentId: string | null;
  body: DataBodyItem;
}

const addDataItemRequestThunk = createAsyncThunk(
  `SLICE_NAME/addDataItemRequestThunk`,
  async ({ parentId, body }: AddDataItemRequestThunkPayload, store) => {
    try {
      const res = await API.addItem(parentId, body);
      if (res === null) {
        throw new Error('Не удалось создать новый элемент');
      }
      store.dispatch(actions.addCreatedItem({ id: res.id, body, parentId }));

      return store.fulfillWithValue(res);
    } catch (e: unknown) {
      console.log(e);

      return store.rejectWithValue(getApiErrors(e));
    }
  },
);

export const treeListSlice = {
  actions,
  selectors,
  thunks: { fetchDataRequestThunk, addDataItemRequestThunk },
} as const;

export const treeListReducer = reducer;

export const getDataView = createSelector(
  (state: RootState) => state.treeList.fetchDataRequest.data,
  (state: RootState) => state.treeList.createItemId,
  (treeList, createItemId) => {
    if (treeList === null) {
      return null;
    }

    return makeRowTreeNodeViewList(treeList, createItemId);
  },
);
