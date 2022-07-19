import { useState } from "react";
import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import Button from "../presentational/Button";
import Chip from "../presentational/Chip";
import Divider from "../presentational/Divider";
import Input from "../presentational/Input";
import Row from "../presentational/Row";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faRemove } from "@fortawesome/free-solid-svg-icons";

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
    <div className={`module`}>
      <Row className={`center space-between moduleHeader`}>
        <h1>Rarities</h1>
      </Row>

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

      <Divider></Divider>

      {rarities.map((rarity) => (
        <Collapsible
          trigger={
            <Row className={"center"}>
              <Button onClick={handleRemove(rarity)}>
                <FontAwesomeIcon icon={faRemove} />
              </Button>
              <Input disabled value={rarity.name}></Input>
              <FontAwesomeIcon icon={faCaretDown} className="icon pointer" />
            </Row>
          }
          key={rarity.name}
        >
          <Row className={"center"}>
            {Number(rarity.percentage).toFixed(1)}%
            <Input
              value={rarity.sliderValue}
              type="range"
              placeholder="Percentage"
              min={0}
              max={100}
              step={1}
              onChange={handleUpdate(rarity)}
            ></Input>
          </Row>

          <Row className={"wrap center"}>
            Layers:
            {layers.map((layer) => {
              const selected = rarity.layers.includes(layer);
              let action = "add";
              if (selected) action = "remove";
              return (
                <Chip
                  key={layer}
                  onClick={handleClick(rarity, layer, action)}
                  selected={selected}
                >
                  {layer}
                </Chip>
              );
            })}
          </Row>
        </Collapsible>
      ))}
    </div>
  );
}
