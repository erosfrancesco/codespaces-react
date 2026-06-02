import { useWebSocketConnection } from "../hooks/useWebSocket";

export function SectionTitle({ children, className }) {
    return <div className={
        "text-white text-2xl mb-4 font-semibold uppercase tracking-wide"
        + (className ? (" " + className) : "")
    }>
        {children}
    </div>
}

export function SectionContent({ children, className }) {
    const { connected } = useWebSocketConnection();

    return <div className={
        // "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 "
        "gap-5"
        + (className ? (" " + className) : "")
    }>
        {connected ? children : "Connect to SERVER"}
    </div>
}

export function Card({ children, className }) {
    return <div className={
        "bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
        + (className ? (" " + className) : "")
    }>
        {children}
    </div>
}