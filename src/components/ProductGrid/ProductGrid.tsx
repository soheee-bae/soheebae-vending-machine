import styles from "./ProductGrid.module.scss";

import { initialInventory } from "../../datas/initialData";
import { Button, Tag } from "..";

function ProductGrid() {
  return (
    <div className={styles.container}>
      {initialInventory.map((inventory) => {
        const isOutOfStock = inventory.stock <= 0;
        const price = inventory.price.toLocaleString("ko-KR");

        return (
          <Button
            onClick={() => {}}
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
