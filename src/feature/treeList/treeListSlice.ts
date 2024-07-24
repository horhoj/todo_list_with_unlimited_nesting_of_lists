import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { makeRowTreeNodeViewList } from './helpers';
import { makeRequestExtraReducer, makeRequestStateProperty, RequestList, RequestStateProperty } from '~/store/helpers';
import { API } from '~/api/api';
import { getApiErrors } from '~/api/common';
import { RootState } from '~/store/types';
import { DataItem } from '~/fakeApi/types';

const SLICE_NAME = 'treeList';

interface IS {
  fetchDataRequest: RequestStateProperty<DataItem[]>;
}

const initialState: IS = {
  fetchDataRequest: makeRequestStateProperty(),
};

const { actions, reducer, selectors } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, fetchDataRequestThunk, 'fetchDataRequest');
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

export const treeListSlice = { actions, selectors, thunks: { fetchDataRequestThunk } } as const;

export const treeListReducer = reducer;

export const getDataView = createSelector(
  (state: RootState) => state.treeList.fetchDataRequest.data,
  (treeList) => {
    if (treeList === null) {
      return null;
    }

    return makeRowTreeNodeViewList(treeList);
  },
);
