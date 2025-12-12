import styles from "./DisplayPanel.module.scss";
import { Display, ProductGrid, SelectedItemDisplay } from "..";

function DisplayPanel() {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <Display />
        <div className={styles.content}>
          <ProductGrid />
          <SelectedItemDisplay />
        </div>
      </div>
    </div>
  );
}
export default DisplayPanel;
