import { RowTreeNodeBody } from '../types';
import styles from './OutlayListViewItem.module.scss';

interface OutlayListViewItemProps {
  itemBody: RowTreeNodeBody;
}
export function OutlayListViewItem({ itemBody }: OutlayListViewItemProps) {
  return (
    <>
      <td>
        <span className={styles.td}>{itemBody.name}</span>
      </td>
      <td>
        <span className={styles.td}>{itemBody.count.toLocaleString()}</span>
      </td>
      <td>
        <span className={styles.td}>{itemBody.sum.toLocaleString()}</span>
      </td>
    </>
  );
}
