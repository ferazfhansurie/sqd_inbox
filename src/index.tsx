import App from './App';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');

const root = createRoot(container!);
root.render(<>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <App />
  </>);
