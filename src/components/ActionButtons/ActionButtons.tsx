import styles from "./ActionButtons.module.scss";

import Button from "../Button/Button";

function ActionButtons() {
  return (
    <div className={styles.container}>
      <Button label="카드 결제" onClick={() => {}} />
      <Button label="잔돈 받기" onClick={() => {}} />
    </div>
  );
}
export default ActionButtons;
