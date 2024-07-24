import classNames from 'classnames';
import { ListConnection } from '../ListConnection';
import { RowTreeNodeView } from '../types';
import styles from './OutlayList.module.scss';
import { CancelIcon, ListItemIcon, TrashItemIcon } from '~/assets/icons';

interface OutlayListProps {
  rowTreeNodeViewList: RowTreeNodeView[];
  deep: number;
}
export function OutlayList({ rowTreeNodeViewList, deep }: OutlayListProps) {
  return (
    <div className={styles.OutlayListWrapper}>
      <table className={styles.OutlayList}>
        <thead>
          <tr>
            <th>
              <span className={styles.levelHeaderWrapper}>
                <button title={'Создать корневой элемент'}>
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
              <tr key={row.body.id} className={classNames(styles.tr)}>
                <td className={styles.levelTd}>
                  <ListConnection listPosition={row.listPosition} deep={deep}>
                    <div className={styles.iconsWrapper}>
                      <button title={'Создать дочерний элемент'}>
                        <ListItemIcon />
                      </button>

                      <button title={'Удалить элемент'}>
                        <TrashItemIcon />
                      </button>

                      {/* <button title={'отменить редактирование элемента'}>
                        <CancelIcon />
                      </button> */}
                    </div>
                  </ListConnection>
                </td>

                <td>{row.body.name}</td>
                <td>{row.body.count}</td>
                <td>{row.body.sum}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
