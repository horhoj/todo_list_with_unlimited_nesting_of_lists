import { useEffect } from 'react';
import { getDataView, treeListSlice } from '../treeListSlice';
import { OutlayList } from '../OutlayList';
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

  return (
    <div className={styles.TreeListWidget}>
      {dataView && <OutlayList deep={1} rowTreeNodeViewList={dataView.result} />}
    </div>
  );
}
