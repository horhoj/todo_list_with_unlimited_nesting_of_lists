import styles from './App.module.scss';
import { TreeListWidget } from '~/feature/treeList/TreeListWidget';

export function App() {
  return (
    <>
      <div className={styles.App}>
        <TreeListWidget />
      </div>
    </>
  );
}
