import styles from "../../styles/Button.module.css";

export default function Button({ children, onClick, className, disabled }) {
  return (
    <div
      className={`${styles.button} ${className} ${disabled && styles.disabled}`}
      onClick={disabled ? null : onClick}
    >
      {children}
    </div>
  );
}
