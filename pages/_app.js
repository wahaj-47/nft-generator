import { ProjectInfoProvider } from "../providers/ProjectInfoProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ProjectInfoProvider>
      <Component {...pageProps} />
    </ProjectInfoProvider>
  );
}

export default MyApp;
