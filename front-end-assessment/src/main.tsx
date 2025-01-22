import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
      <FluentProvider theme={webLightTheme}>
        <App />
      </FluentProvider>
  </StrictMode>
);
