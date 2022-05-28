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

      {raritiesWithLayersRequiringPercentage.map((rarity) => (
        <div key={rarity.name}>
          <Row className={"center"}>
            Rarity:<Input disabled value={rarity.name}></Input>
          </Row>
          {rarity.layers.map((layer) => (
            <div>
              <Row className={"center space-between"}>
                <Row className={"center"}>
                  Layer:<Input disabled value={layer.name}></Input>
                </Row>

                <Row className={"center"}>
                  Layer Visible:
                  <Input
                    checked={layer.visible}
                    disabled={layer.disabled}
                    type="checkbox"
                    className="flex-0 ml-5"
                    onChange={setLayerVisibility(rarity, layer)}
                  ></Input>
                </Row>
              </Row>

              {layer.visible ? (
                <div className={`module`}>
                  <h2>Rarity Percentages</h2>
                  {layer.rarities.map((layerRarity) => (
                    <Row className={"center"}>
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
          ))}
        </div>
      ))}

      <Divider></Divider>
    </div>
  );
}
