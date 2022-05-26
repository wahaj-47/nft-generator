import styles from "../../styles/Row.module.css";

export default function Row({ children, className }) {
  return <div className={[styles.row, className].join(" ")}>{children}</div>;
}
