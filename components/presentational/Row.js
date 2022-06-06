import styles from "../../styles/Row.module.css";

export default function Row({ children, className, ...props }) {
  return (
    <div
      ref={props.innerRef}
      className={[styles.row, className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
