import { initialRemainingCash } from "../../datas/initialData";
import styles from "./CashEntries.module.scss";

function CashEntries() {
  const cashEntries = Object.entries(initialRemainingCash);

  return (
    <div className={styles.container}>
      <p className={styles.title}>자판기 잔돈 상태</p>
      <div>
        {cashEntries
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([amount, count]) => {
            const amountNumber = Number(amount);
            const formattedAmount = amountNumber.toLocaleString("ko-KR");

            return (
              <div key={amount} className={styles.cashLabel}>
                <span>{formattedAmount}</span>
                <span>{count}개</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default CashEntries;
