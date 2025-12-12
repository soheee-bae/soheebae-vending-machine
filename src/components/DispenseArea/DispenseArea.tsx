import styles from "./DispenseArea.module.scss";

function DispenseArea() {
  return (
    <div className={styles.container}>
      <p>상품 나오는 곳</p>
      <div className={styles.box} />
    </div>
  );
}
export default DispenseArea;
