import styles from "../../styles/Column.module.css";

export default function Column({ children, span }) {
  return (
    <div className={styles.column} style={{ flex: span }}>
      {children}
    </div>
  );
}
