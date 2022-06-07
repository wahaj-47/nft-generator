import { useState } from "react";
import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import Button from "../presentational/Button";
import Divider from "../presentational/Divider";
import Input from "../presentational/Input";
import Row from "../presentational/Row";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRemove } from "@fortawesome/free-solid-svg-icons";

export default function Layers() {
  const { layers, addLayer, removeLayer, reorderLayers } =
    useProjectInfoContext();

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

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    reorderLayers(result);
  };

  return (
    <div className={`module`}>
      <Row className={`center space-between moduleHeader`}>
        <h1>Layers</h1>
      </Row>

      <Row>
        <Input
          value={layer}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="New layer"
        ></Input>
        <Button onClick={handleAdd}>Add</Button>
      </Row>

      <Divider></Divider>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {layers.map((layer, index) => (
                <Draggable key={layer} draggableId={layer} index={index}>
                  {(provided) => (
                    <Row
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="center"
                    >
                      <Button onClick={handleRemove(layer)}>
                        <FontAwesomeIcon icon={faRemove} />
                      </Button>
                      <Input disabled value={layer}></Input>
                      <FontAwesomeIcon icon={faBars} className="icon" />
                    </Row>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
