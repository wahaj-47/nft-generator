import { useState, useRef } from "react";
import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import styles from "../../styles/Rarities.module.css";
import Button from "../presentational/Button";
import Chip from "../presentational/Chip";
import Divider from "../presentational/Divider";
import Input from "../presentational/Input";
import Row from "../presentational/Row";

export default function Rarities() {
  const {
    layers,
    rarities,
    addRarity,
    removeRarity,
    updateRarityLayers,
    updateRarityPercentage,
  } = useProjectInfoContext();

  const [rarity, setRarity] = useState("");

  const handleChange = (e) => {
    switch (e.target.name) {
      case "name":
        setRarity(e.target.value);
        break;

      default:
        break;
    }
  };

  const handleAdd = () => {
    if (layers.length < 1) {
      alert("Add atleast one layer");
      return;
    }
    if (layers.includes(rarity)) {
      alert("Rarity name cannot be the same as layer name");
      return;
    }
    if (!rarity) {
      alert("Enter rarity name");
      return;
    }

    addRarity(rarity);
    setRarity("");
  };

  const handleRemove = (rarity) => () => {
    removeRarity(rarity);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && rarity) {
      handleAdd();
    }
  };

  const handleClick = (rarity, layer, action) => () => {
    updateRarityLayers(rarity, layer, action);
  };

  const handleUpdate = (rarity) => (e) => {
    updateRarityPercentage(rarity, e.target.value);
  };

  return (
    <div className={`module ${styles.container}`}>
      <Row className={`center space-between moduleHeader`}>
        <h1>Rarities</h1>
      </Row>

      {rarities.map((rarity) => (
        <div>
          <Row className={"center"}>
            Name:<Input disabled value={rarity.name}></Input>
          </Row>
          <Row className={"center"}>
            Percentage: {Number(rarity.percentage).toFixed(1)}%
            <Input
              value={rarity.sliderValue}
              type="range"
              placeholder="Percentage"
              min={1}
              max={100}
              step={1}
              onChange={handleUpdate(rarity)}
            ></Input>
            <Button onClick={handleRemove(rarity)}>Remove</Button>
          </Row>
          <Row className={"wrap center"}>
            Layers:
            {layers.map((layer) => {
              const selected = rarity.layers.includes(layer);
              let action = "add";
              if (selected) action = "remove";
              return (
                <Chip
                  onClick={handleClick(rarity, layer, action)}
                  selected={selected}
                >
                  {layer}
                </Chip>
              );
            })}
          </Row>
        </div>
      ))}

      <Divider></Divider>

      <Row className={"center"}>
        Name:
        <Input
          name="name"
          value={rarity}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="New rarity"
        ></Input>
        <Button onClick={handleAdd}>Add</Button>
      </Row>
    </div>
  );
}
