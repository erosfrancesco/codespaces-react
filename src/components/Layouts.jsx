
import { useWebSocket } from "../hooks/useWebSocket";

export function SectionTitle({ children, className }) {
    return <div className={
        "text-white text-2xl mb-4 font-semibold uppercase tracking-wide"
        + (className ? (" " + className) : "")
    }>
        {children}
    </div>
}

export function SectionContent({ children, className }) {
    const { connected } = useWebSocket();

    if (!connected) {
        return <div>
            Connect to SERVER
        </div>
    }

    return <div className={
        "gap-5"
        + (className ? (" " + className) : "")
    }>
        {children}
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

export function Dialog({ children, onClose }) {
    return <div className="text-black fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose()
    }}>
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => {
            e.preventDefault();
            e.stopPropagation();
        }}>
            {children}
        </div>
    </div>
}
