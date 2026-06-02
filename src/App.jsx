import './App.css';
import { WebSocketProvider } from './hooks/useWebSocket';
import { Dashboard } from './sections/Dashboard';

function App() {
  return (
    <div className="App">
      <WebSocketProvider>
        <Dashboard />
      </WebSocketProvider>
    </div>
  );
}

export default App;
