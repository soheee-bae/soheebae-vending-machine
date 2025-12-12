import clsx from "clsx";
import styles from "./Tag.module.scss";
import type { ReactNode } from "react";

type Size = "sm" | "md";
type Color = "light" | "dark";

interface TagProps {
  size?: Size;
  color?: Color;
  label?: string;
  icon?: ReactNode;
}

function Tag(props: TagProps) {
  const { size = "md", color = "light", label, icon } = props;

  if (!label) return null;

  return (
    <div
      className={clsx(styles.container, styles[size], {
        [styles.darkerGray]: color === "dark",
      })}
    >
      {icon}
      {label}
    </div>
  );
}
export default Tag;
