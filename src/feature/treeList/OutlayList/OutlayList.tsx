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
  onEdit: (id: string) => void;
  onEditCancel: () => void;
  onEditSubmit: (id: string, body: RowTreeFormValues) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}
export function OutlayList({
  rowTreeNodeViewList,
  deep,
  onCreate,
  onCreateCancel,
  onCreateSubmit,
  onEdit,
  onEditCancel,
  onEditSubmit,
  onDelete,
  disabled,
}: OutlayListProps) {
  return (
    <div className={styles.OutlayListWrapper}>
      <table className={styles.OutlayList}>
        <thead>
          <tr>
            <th>
              <span className={styles.levelHeaderWrapper}>
                <button title={'Создать корневой элемент'} onClick={() => onCreate(null)} disabled={disabled}>
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
              <tr
                key={row.body.id}
                className={classNames(styles.tr)}
                title={'Двойной щелчёк для изменения'}
                onDoubleClick={() => onEdit(row.body.id)}
                role="button"
              >
                <td className={styles.levelTd}>
                  <ListConnection listPosition={row.listPosition} deep={deep}>
                    <div className={styles.iconsWrapper}>
                      <button
                        title={'Создать дочерний элемент'}
                        onClick={() => onCreate(row.body.id)}
                        disabled={disabled}
                      >
                        <ListItemIcon />
                      </button>

                      {!row.isNew && !row.isEdit && (
                        <button title={'Удалить элемент'} onClick={() => onDelete(row.body.id)} disabled={disabled}>
                          <TrashItemIcon />
                        </button>
                      )}

                      {row.isNew && (
                        <button title={'отменить добавление элемента'} onClick={onCreateCancel} disabled={disabled}>
                          <CancelIcon />
                        </button>
                      )}
                      {row.isEdit && (
                        <button title={'отменить редактирование элемента'} onClick={onEditCancel} disabled={disabled}>
                          <CancelIcon />
                        </button>
                      )}
                    </div>
                  </ListConnection>
                </td>

                {!row.isNew && !row.isEdit && <OutlayListViewItem itemBody={row.body} />}
                {row.isNew && (
                  <OutlayListEditItem
                    itemBody={row.body}
                    onSubmit={(_, values) => onCreateSubmit(row.parentId, values)}
                    disabled={disabled}
                  />
                )}
                {row.isEdit && (
                  <OutlayListEditItem
                    itemBody={row.body}
                    onSubmit={(_, values) => onEditSubmit(row.body.id, values)}
                    disabled={disabled}
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
