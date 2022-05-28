import { ProjectInfoProvider } from "../providers/ProjectInfoProvider";
import "../styles/globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

function MyApp({ Component, pageProps }) {
  return (
    <ProjectInfoProvider>
      <Component {...pageProps} />
    </ProjectInfoProvider>
  );
}

export default MyApp;
