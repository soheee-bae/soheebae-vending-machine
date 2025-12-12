import styles from "./CashInputButton.module.scss";
import Button from "../Button/Button";
import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";
import { CashList } from "../../datas/initialData";

function CashInputButton() {
  const { actions, isLoading } = useVendingMachineContext();

  return (
    <div className={styles.container}>
      <p className={styles.title}>현금</p>
      <div className={styles.cards}>
        {CashList.map((cash) => {
          const cashAmount = cash.toLocaleString("ko-KR");
          return (
            <Button
              key={cash}
              disabled={isLoading}
              label={`${cashAmount}원`}
              size="sm"
              onClick={() => {
                actions?.insertMoney(cash);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
export default CashInputButton;
