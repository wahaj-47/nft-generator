import styles from "../../styles/Chip.module.css";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import Row from "./Row";

export default function Chip({ children, selected, onClick }) {
  return (
    <div
      className={[styles.chip, selected && styles.selected].join(" ")}
      onClick={onClick}
    >
      <Row className={"center"}>
        {selected ? (
          <AiFillCheckCircle className="mr-5" color="#C1E1C1" />
        ) : (
          <AiFillCloseCircle className="mr-5" color="#FF6961" />
        )}
        {children}
      </Row>
    </div>
  );
}
