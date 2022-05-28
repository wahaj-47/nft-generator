import { useProjectInfoContext } from "../../providers/ProjectInfoProvider";
import Button from "../presentational/Button";
import Input from "../presentational/Input";
import Row from "../presentational/Row";

export default function ProjectSettings() {
  const { projectSettings, updateProjectSettings, reset, submit } =
    useProjectInfoContext();

  return (
    <div className={`module`}>
      <Row className={`center space-between moduleHeader`}>
        <h1>Project Settings</h1>
        <Button onClick={reset}>Reset</Button>
      </Row>
      <Row>
        <Input
          value={projectSettings.name}
          placeholder="Project Name"
          onChange={updateProjectSettings("name")}
        ></Input>
      </Row>
      <Row>
        <Input
          value={projectSettings.description}
          placeholder="Project Description"
          onChange={updateProjectSettings("description")}
        ></Input>
      </Row>
      <Row>
        <Input
          value={parseInt(projectSettings.size)}
          type="number"
          placeholder="Collection Size"
          min={0}
          onChange={updateProjectSettings("size")}
        ></Input>
      </Row>
      <Row>
        <Input
          value={parseInt(projectSettings.width)}
          type="number"
          placeholder="Width"
          min={0}
          onChange={updateProjectSettings("width")}
        ></Input>
        <Input
          value={parseInt(projectSettings.height)}
          type="number"
          placeholder="Height"
          min={0}
          onChange={updateProjectSettings("height")}
        ></Input>
      </Row>
      <Row className={"space-between"}>
        <Button className={"flex mr-5"} disabled>
          Preview
        </Button>
        <Button onClick={submit} className={"flex ml-5"}>
          Generate
        </Button>
      </Row>
    </div>
  );
}
