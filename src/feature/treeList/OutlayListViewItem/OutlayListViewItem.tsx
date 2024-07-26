import { RowTreeNodeBody } from '../types';
// import styles from './OutlayListViewItem.module.scss';

interface OutlayListViewItemProps {
  itemBody: RowTreeNodeBody;
}
export function OutlayListViewItem({ itemBody }: OutlayListViewItemProps) {
  return (
    <>
      <td>{itemBody.name}</td>
      <td>{itemBody.count.toLocaleString()}</td>
      <td>{itemBody.sum.toLocaleString()}</td>
    </>
  );
}
