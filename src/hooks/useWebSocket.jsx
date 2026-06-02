import React from 'react';

const WebSocketContext = React.createContext(null);

export function WebSocketProvider({ children }) {
    const websocket = useWebSocketConnection();

    return (
        <WebSocketContext.Provider value={websocket}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = React.useContext(WebSocketContext);

    if (!context) {
        throw new Error(
            'useWebSocket must be used within a WebSocketProvider'
        );
    }

    return context;
}

export function useWebSocketConnection() {
    const [connected, setConnected] = React.useState(false);
    const [lastMessage, setLastMessage] = React.useState(null);
    const [error, setError] = React.useState('');
    const [showConfig, setShowConfig] = React.useState(false);
    const [tempUrl, setTempUrl] = React.useState(getServerUrl());
    const [serverUrl, setServerUrl] = React.useState(getServerUrl());

    const ws = React.useRef(null);

    function connectWebSocket() {
        ws.current = new WebSocket(serverUrl);

        ws.current.onopen = () => {
            setConnected(true);
            setError('');
        };

        ws.current.onmessage = event => {
            try {
                setLastMessage(JSON.parse(event.data));
            } catch (e) {
                console.error(e);
            }
        };

        ws.current.onerror = () => {
            setError('Connection error');
        };

        ws.current.onclose = () => {
            setConnected(false);
        };
    }

    function send(data) {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    }

    function handleConnect() {
        if (!tempUrl.trim()) return;

        sessionStorage.setItem('ws_server_url', tempUrl.trim());
        setServerUrl(tempUrl.trim());
        setShowConfig(false);
    }

    function handlePersistent() {
        if (!tempUrl.trim()) return;

        localStorage.setItem('ws_server_url_persistent', tempUrl.trim());
        sessionStorage.setItem('ws_server_url', tempUrl.trim());
        setServerUrl(tempUrl.trim());
        setShowConfig(false);
    }

    function handleReset() {
        sessionStorage.removeItem('ws_server_url');
        localStorage.removeItem('ws_server_url_persistent');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const defaultUrl = protocol;

        setTempUrl(defaultUrl);
        setServerUrl(defaultUrl);
        setShowConfig(false);
    }

    React.useEffect(() => {
        connectWebSocket();
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [serverUrl]);

    return {
        connected,
        lastMessage,
        send,
        error,
        ws,

        connectWebSocket,
        handleConnect,
        handlePersistent,
        handleReset,

        setTempUrl, tempUrl,
        setShowConfig, showConfig,
        setError, error
    };
}

function getServerUrl() {
    const stored = sessionStorage.getItem('ws_server_url');
    if (stored) return stored;
    const persistent = localStorage.getItem('ws_server_url_persistent');
    if (persistent) return persistent;
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get('server');
    if (paramUrl) return paramUrl;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    return protocol; //window.location.hostname:8765
}