import { useState } from "react";
import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import styles from "../../styles/Layers.module.css";
import Button from "../presentational/Button";
import Divider from "../presentational/Divider";
import Input from "../presentational/Input";
import Row from "../presentational/Row";

export default function Layers() {
  const { layers, addLayer, removeLayer } = useProjectInfoContext();

  const [layer, setLayer] = useState("");

  const handleChange = (e) => {
    setLayer(e.target.value);
  };

  const handleAdd = () => {
    if (!layer) {
      alert("Enter layer name");
      return;
    }
    addLayer(layer);
    setLayer("");
  };

  const handleRemove = (layer) => () => {
    removeLayer(layer);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && layer) {
      handleAdd();
    }
  };

  return (
    <div className={`module ${styles.container}`}>
      <Row className={`center space-between moduleHeader`}>
        <h1>Layers</h1>
      </Row>

      {layers.map((layer) => (
        <Row key={layer}>
          <Input disabled value={layer}></Input>
          <Button onClick={handleRemove(layer)}>Remove</Button>
        </Row>
      ))}

      <Divider></Divider>

      <Row>
        <Input
          value={layer}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="New layer"
        ></Input>
        <Button onClick={handleAdd}>Add</Button>
      </Row>
    </div>
  );
}
