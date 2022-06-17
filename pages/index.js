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

import { ChonkyActions, setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import LinkRarities from "../components/containers/LinkRarities";
import Header from "../components/containers/Header";

setChonkyDefaults({
  iconComponent: ChonkyIconFA,
  disableDragAndDrop: true,
  defaultSortActionId: ChonkyActions.SortFilesByDate.id,
});

export default function Home() {
  return (
    <Container>
      <Head></Head>

      <Main>
        <Header></Header>

        <Row>
          <Column>
            <ProjectSettings></ProjectSettings>
            <Layers></Layers>
          </Column>

          <Column span={2}>
            <Explorer></Explorer>
          </Column>

          <Column>
            <Rarities></Rarities>
            <LinkRarities></LinkRarities>
          </Column>
        </Row>
      </Main>

      <Footer></Footer>
    </Container>
  );
}
