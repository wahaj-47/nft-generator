import Explorer from "../components/containers/Explorer";
import Layers from "../components/containers/Layers";
import ProjectSettings from "../components/containers/ProjectSettings";
import Rarities from "../components/containers/Rarities";
import Column from "../components/presentational/Column";
import Container from "../components/presentational/Container";
import Footer from "../components/presentational/Footer";
import Head from "../components/presentational/Head";
import Main from "../components/presentational/Main";
import Row from "../components/presentational/Row";

import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  disableDragAndDrop: true,
});

export default function Home() {
  return (
    <Container>
      <Head></Head>

      <Main>
        <Row>
          <Column>
            <Layers></Layers>
            <Rarities></Rarities>
          </Column>
          <Column span={2}>
            <Explorer></Explorer>
          </Column>
          <Column>
            <ProjectSettings></ProjectSettings>
          </Column>
        </Row>
      </Main>

      <Footer></Footer>
    </Container>
  );
}
