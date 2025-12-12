import clsx from "clsx";
import styles from "./Button.module.scss";
import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg";
type Color = "light" | "dark";

interface Button {
  size?: Size;
  color?: Color;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

function Button(props: Button) {
  const {
    size = "md",
    color = "light",
    label,
    disabled,
    className,
    onClick,
  } = props;

  return (
    <div
      className={clsx(styles.container, className, styles[size], {
        [styles.black]: color === "dark",
        [styles.disabled]: disabled,
      })}
      onClick={onClick}
    >
      {label}
    </div>
  );
}
export default Button;
