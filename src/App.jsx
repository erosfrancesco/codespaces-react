import { WebSocketProvider } from './hooks/useWebSocket';
import { Dashboard } from './sections/Dashboard';

function App() {
  return (
    <WebSocketProvider>
      <Dashboard />
    </WebSocketProvider>
  );
}

export default App;
