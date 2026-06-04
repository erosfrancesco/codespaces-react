import { useWebSocket } from "../hooks/useWebSocket";
import { Dialog } from "../components/Layouts";
import { useEffect, useState } from "react";
import { useBoardPinout } from "../hooks/useBoardPinout";



// Connection (WebSocket) status and configuration
export function ConnectionSection() {
    const [showConfig, setShowConfig] = useState();
    const { connected } = useWebSocket();
    const { name } = useBoardPinout();

    return <div className="text-white mb-8 text-center">
        {/** CONTENT */}
        <h1 className="text-5xl mb-3">🎛️ Raspberry Pi Dashboard</h1>
        <div className="flex items-center justify-center gap-3 text-lg">
            <span className="font-bold">{name}</span>
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>

        {/** CTA */}
        <div className="fixed bottom-5 right-5 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm font-mono cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            onClick={() => setShowConfig(true)}>
            🔧 {name}
        </div>

        {/** Dialog */}
        {showConfig && <ConnectionOptions onClose={() => setShowConfig(false)} />}
    </div>
}


export function ConnectionOptions({ onClose }) {
    const {
        connected,
        status,
        serverUrl,
        setServerUrl,
        resetServerUrl,
        testConnection,
    } = useWebSocket();

    const [tempUrl, setTempUrl] = useState(serverUrl || "");
    const [testing, setTesting] = useState(false);
    const [testSuccess, setTestSuccess] = useState(false);
    const [error, setError] = useState("");

    // keep input in sync if global URL changes
    useEffect(() => {
        setTempUrl(serverUrl || "");
    }, [serverUrl]);

    // -----------------------------
    // CONNECT (real)
    // -----------------------------
    function handleConnect() {
        if (!tempUrl?.trim()) return;

        setServerUrl(tempUrl.trim());
        onClose();
    }

    // -----------------------------
    // RESET
    // -----------------------------
    function handleReset() {
        resetServerUrl();
        setTempUrl("");
        setError("");
    }

    // -----------------------------
    // TRY CONNECTION (temp socket)
    // -----------------------------
    async function handleTryConnection() {
        if (!tempUrl?.trim()) return;

        setTesting(true);
        setError("");

        try {
            await testConnection(tempUrl.trim(), 5000);

            // success → apply
            setServerUrl(tempUrl.trim());
            setTestSuccess(true);
        } catch (err) {
            console.error(err);

            resetServerUrl();
            setError("Connection failed");
        } finally {
            setTesting(false);
        }
    }

    return (
        <Dialog onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Server Configuration
            </h2>

            {/* INPUT */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    WebSocket Server URL
                </label>

                <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="ws://192.168.1.100:8765"
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                />

                <div className="text-sm text-gray-600 mt-1">
                    ws://HOST:PORT or wss://HOST:PORT
                </div>
            </div>

            {/* STATUS */}
            <div className="mb-4 text-sm text-gray-700">
                <div>Global status: {status}</div>
                <div>Local connected: {connected ? "yes" : "no"}</div>
                <div>Current URL: {serverUrl || "none"}</div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mb-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={handleConnect}
                    disabled={!tempUrl?.trim() || testing}
                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg"
                >
                    Connect
                </button>

                <button
                    onClick={handleTryConnection}
                    disabled={!tempUrl?.trim() || testing}
                    className={"flex-1 py-2 px-4 text-white rounded-lg " + (testSuccess ? "bg-green-500" : testing ? "bg-blue-500" : error ? "bg-red-500" : "bg-green-500")}
                >
                    {testing ? "Testing..." : testSuccess ? "Success!" : "Test"}

                </button>

                <button
                    onClick={handleReset}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg"
                >
                    Reset
                </button>
            </div>
        </Dialog>
    );
}

