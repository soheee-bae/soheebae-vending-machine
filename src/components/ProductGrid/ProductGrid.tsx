import styles from "./ProductGrid.module.scss";
import { Button, Tag } from "..";
import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";

function ProductGrid() {
  const { actions, state, isSelectable } = useVendingMachineContext();
  return (
    <div className={styles.container}>
      {state.inventory.map((inventory) => {
        const isOutOfStock = inventory.stock <= 0;
        const price = inventory.price.toLocaleString("ko-KR");
        const disabled = !isSelectable(inventory.price, inventory.stock);

        return (
          <Button
            onClick={() => actions?.selectDrink(inventory.id)}
            disabled={disabled}
            key={inventory.id}
            label={
              <div key={inventory.id} className={styles.card}>
                <div className={styles.cardContent}>
                  {inventory.icon}
                  <div className={styles.info}>
                    <p>{inventory.name}</p>
                    <p>{price}원</p>
                  </div>
                </div>
                {isOutOfStock ? (
                  <Tag label="Out of Stock" />
                ) : (
                  <p className={styles.stock}>{inventory.stock} LEFT</p>
                )}
              </div>
            }
            size="lg"
          />
        );
      })}
    </div>
  );
}
export default ProductGrid;
