import classNames from 'classnames';
import { ListConnection } from '../ListConnection';
import { RowTreeFormValues, RowTreeNodeView } from '../types';
import { OutlayListViewItem } from '../OutlayListViewItem';
import { OutlayListEditItem } from '../OutlayListEditItem';
import styles from './OutlayList.module.scss';
import { CancelIcon, ListItemIcon, TrashItemIcon } from '~/assets/icons';

interface OutlayListProps {
  rowTreeNodeViewList: RowTreeNodeView[];
  deep: number;
  onCreate: (parentId: string | null) => void;
  onCreateCancel: () => void;
  onCreateSubmit: (parentId: string | null, body: RowTreeFormValues) => void;
}
export function OutlayList({ rowTreeNodeViewList, deep, onCreate, onCreateCancel, onCreateSubmit }: OutlayListProps) {
  return (
    <div className={styles.OutlayListWrapper}>
      <table className={styles.OutlayList}>
        <thead>
          <tr>
            <th>
              <span className={styles.levelHeaderWrapper}>
                <button title={'Создать корневой элемент'} onClick={() => onCreate(null)}>
                  <ListItemIcon />
                </button>
                <span>Уровень</span>
              </span>
            </th>
            <th>Наименование</th>
            <th>Кол-во</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {rowTreeNodeViewList.map((row) => {
            return (
              <tr key={row.body.id} className={classNames(styles.tr)} title={'Двойной щелчёк для изменения'}>
                <td className={styles.levelTd}>
                  <ListConnection listPosition={row.listPosition} deep={deep}>
                    <div className={styles.iconsWrapper}>
                      <button title={'Создать дочерний элемент'} onClick={() => onCreate(row.body.id)}>
                        <ListItemIcon />
                      </button>

                      {!row.isNew && (
                        <button title={'Удалить элемент'}>
                          <TrashItemIcon />
                        </button>
                      )}

                      {row.isNew && (
                        <button title={'отменить редактирование элемента'} onClick={onCreateCancel}>
                          <CancelIcon />
                        </button>
                      )}
                    </div>
                  </ListConnection>
                </td>

                {!row.isNew && <OutlayListViewItem itemBody={row.body} />}
                {row.isNew && (
                  <OutlayListEditItem
                    itemBody={row.body}
                    onSubmit={(_, values) => onCreateSubmit(row.parentId, values)}
                  />
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
