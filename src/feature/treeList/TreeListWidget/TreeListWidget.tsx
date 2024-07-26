import { useEffect } from 'react';
import { getDataView, treeListSlice } from '../treeListSlice';
import { OutlayList } from '../OutlayList';
import { RowTreeFormValues } from '../types';
import styles from './TreeListWidget.module.scss';
import { useAppDispatch, useAppSelector } from '~/store/hooks';

export function TreeListWidget() {
  const dispatch = useAppDispatch();
  const dataView = useAppSelector(getDataView);

  useEffect(() => {
    dispatch(treeListSlice.thunks.fetchDataRequestThunk());
    return () => {
      dispatch(treeListSlice.actions.clear());
    };
  }, [dispatch]);

  const handleCreate = (parentId: string | null) => {
    dispatch(treeListSlice.actions.setCreateItemId({ value: parentId }));
  };

  const handleCreateCancel = () => {
    dispatch(treeListSlice.actions.setCreateItemId(null));
  };

  const handleCreateSubmit = (parentId: string | null, body: RowTreeFormValues) => {
    dispatch(treeListSlice.thunks.addDataItemRequestThunk({ parentId, body }));
  };

  const handleEdit = (id: string) => {
    dispatch(treeListSlice.actions.setEditItemId(id));
  };

  const handleEditCancel = () => {
    dispatch(treeListSlice.actions.setEditItemId(null));
  };

  const handleEditSubmit = (id: string, body: RowTreeFormValues) => {
    dispatch(treeListSlice.thunks.patchDataItemRequestThunk({ id, body }));
  };

  return (
    <div className={styles.TreeListWidget}>
      {dataView && (
        <OutlayList
          deep={1}
          rowTreeNodeViewList={dataView.result}
          onCreate={handleCreate}
          onCreateCancel={handleCreateCancel}
          onCreateSubmit={handleCreateSubmit}
          onEdit={handleEdit}
          onEditCancel={handleEditCancel}
          onEditSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
