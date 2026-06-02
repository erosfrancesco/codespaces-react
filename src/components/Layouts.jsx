import { useWebSocketConnection } from "../hooks/useWebSocket";

export function SectionTitle({ children }) {
    return <div className="text-white text-2xl mb-4 font-semibold uppercase tracking-wide">
        {children}
    </div>
}

export function SectionContent({ children }) {
    const { connected } = useWebSocketConnection();

    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {connected ? children : "Connect to SERVER"}
    </div>
}