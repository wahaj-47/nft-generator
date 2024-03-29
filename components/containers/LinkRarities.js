import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import Divider from "../presentational/Divider";
import Input from "../presentational/Input";
import Row from "../presentational/Row";

export default function LinkRarities() {
  const {
    raritiesWithLayersRequiringPercentage,
    setLayerVisibility,
    setLayerRarityPercentage,
  } = useProjectInfoContext();

  return (
    <div className={`module`}>
      <Row className={`center space-between moduleHeader`}>
        <h1>Link Rarities</h1>
      </Row>

      {raritiesWithLayersRequiringPercentage.length < 1 ? (
        <p>None of the layers require linking</p>
      ) : null}

      {raritiesWithLayersRequiringPercentage.map((rarity) => (
        <Collapsible
          trigger={
            <Row className={"center"}>
              <Input disabled value={rarity.name}></Input>
              <FontAwesomeIcon icon={faCaretDown} className="icon pointer" />
            </Row>
          }
          key={rarity.name}
        >
          <div className={`module`}>
            {rarity.layers.map((layer) => (
              <Collapsible
                trigger={
                  <Row className={"center space-between"}>
                    <Row className={"center"}>
                      Layer:
                      <Input disabled value={layer.name}></Input>
                    </Row>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className="icon pointer"
                    />
                  </Row>
                }
                key={layer.name}
              >
                <div>
                  <Row className={"center"}>
                    Visible:
                    <Input
                      checked={layer.visible}
                      disabled={layer.disabled}
                      type="checkbox"
                      className="flex-0 ml-5"
                      onChange={setLayerVisibility(rarity, layer)}
                    ></Input>
                  </Row>
                  {layer.visible ? (
                    <div className={`module`}>
                      <h2>Rarity Percentages</h2>
                      {layer.rarities.map((layerRarity) => (
                        <Row key={layerRarity.name} className={"center"}>
                          {layerRarity.name}:{" "}
                          {Number(layerRarity.percentage).toFixed(1)}%
                          <Input
                            value={layerRarity.sliderValue}
                            type="range"
                            placeholder="Percentage"
                            min={0}
                            max={100}
                            step={1}
                            onChange={setLayerRarityPercentage(
                              rarity,
                              layer,
                              layerRarity
                            )}
                          ></Input>
                        </Row>
                      ))}
                    </div>
                  ) : null}
                </div>
                <Divider></Divider>
              </Collapsible>
            ))}
          </div>
          <Divider></Divider>
        </Collapsible>
      ))}
    </div>
  );
}
