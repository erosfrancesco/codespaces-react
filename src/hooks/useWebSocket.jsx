import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const WebSocketContext = createContext(null);

function getInitialUrl() {
    return (
        localStorage.getItem("ws_server_url") ||
        sessionStorage.getItem("ws_server_url") ||
        ""
    );
}

export function WebSocketProvider({ children }) {
    const [serverUrl, setServerUrlState] = useState(getInitialUrl);
    const [status, setStatus] = useState("disconnected");
    const [error, setError] = useState("");

    const socketRef = useRef(null);
    const listenersRef = useRef(new Set());

    // -----------------------------
    // MAIN CONNECTION
    // -----------------------------
    useEffect(() => {
        if (!serverUrl) {
            setStatus("disconnected");
            return;
        }

        setStatus("connecting");

        const socket = new WebSocket(serverUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            setStatus("connected");
            setError("");
        };

        socket.onerror = () => {
            setStatus("error");
            setError("Connection error");
        };

        socket.onclose = () => {
            setStatus("disconnected");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                listenersRef.current.forEach((listener) => {
                    try {
                        listener(data);
                    } catch (err) {
                        console.error("Listener error:", err);
                    }
                });
            } catch (err) {
                console.error("Parse error:", err);
            }
        };

        return () => {
            socket.close();
        };
    }, [serverUrl]);

    // -----------------------------
    // SEND MESSAGE
    // -----------------------------
    const send = useCallback((data) => {
        const socket = socketRef.current;

        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
            return true;
        }

        return false;
    }, []);

    // -----------------------------
    // SUBSCRIBE TO MESSAGES
    // -----------------------------
    const subscribe = useCallback((listener) => {
        listenersRef.current.add(listener);

        return () => {
            listenersRef.current.delete(listener);
        };
    }, []);

    // -----------------------------
    // SET SERVER URL
    // -----------------------------
    const setServerUrl = useCallback((url, persistent = true) => {
        const trimmed = url.trim();
        if (!trimmed) return;

        if (persistent) {
            localStorage.setItem("ws_server_url", trimmed);
        } else {
            sessionStorage.setItem("ws_server_url", trimmed);
        }

        setServerUrlState(trimmed);
    }, []);

    const resetServerUrl = useCallback(() => {
        localStorage.removeItem("ws_server_url");
        sessionStorage.removeItem("ws_server_url");
        setServerUrlState("");
    }, []);

    // -----------------------------
    // TEST CONNECTION (temporary socket)
    // -----------------------------
    const testConnection = useCallback((url, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            let socket;

            try {
                socket = new WebSocket(url);
            } catch (err) {
                reject(err);
                return;
            }

            const timer = setTimeout(() => {
                socket.close();
                reject(new Error("Connection timeout"));
            }, timeout);

            socket.onopen = () => {
                clearTimeout(timer);
                socket.close();
                resolve(true);
            };

            socket.onerror = () => {
                clearTimeout(timer);
                socket.close();
                reject(new Error("Connection failed"));
            };
        });
    }, []);

    // -----------------------------
    // CONTEXT VALUE
    // -----------------------------
    const value = {
        serverUrl,
        setServerUrl,
        resetServerUrl,

        status,
        connected: status === "connected",
        error,

        send,
        subscribe,
        testConnection,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}

// -----------------------------
// BASE HOOK
// -----------------------------
export function useWebSocket() {
    const ctx = useContext(WebSocketContext);

    if (!ctx) {
        throw new Error("useWebSocket must be used inside WebSocketProvider");
    }

    return ctx;
}

// -----------------------------
// MESSAGE SUBSCRIPTION HOOK
// -----------------------------
export function useWSMessages(handler) {
    const { subscribe } = useWebSocket();

    useEffect(() => {
        if (!handler) return;
        return subscribe(handler);
    }, [subscribe, handler]);
}