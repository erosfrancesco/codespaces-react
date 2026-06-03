import { SensorsProvider } from './hooks/useSensors';
import { WebSocketProvider } from './hooks/useWebSocket';
import { Dashboard } from './sections/Dashboard';

function App() {
  return (
    <WebSocketProvider>
      <SensorsProvider>
        <Dashboard />
      </SensorsProvider>
    </WebSocketProvider>
  );
}

export default App;
