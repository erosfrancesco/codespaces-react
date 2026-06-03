import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocketConnection } from './useWebSocket';

const BoardPinoutContext = createContext(null);

export function BoardPinoutProvider({ children }) {
    const value = useBoardPinout();

    return (
        <BoardPinoutContext.Provider value={value}>
            {children}
        </BoardPinoutContext.Provider>
    );
}

export function useBoardPinoutContext() {
    const context = useContext(BoardPinoutContext);

    if (!context) {
        throw new Error(
            'useSensors must be used within a SensorsProvider'
        );
    }

    return context;
}


// TODO: - use config_store set and get for board management
export function useBoardPinout() {
    const [pins, setPins] = useState({});

    // WS integration
    const { ws } = useWebSocketConnection();

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = event => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'init' || data.type === 'state') {
                    if ('gpio' in data) {
                        setPins(data.gpio);
                    }
                }

            } catch (e) {
                console.error('[USEBOARD] Error parsing message:', e);
            }
        };

        ws.current.onerror = error => {
            console.error('[USEBOARD] WebSocket error:', error);
        };
    }, [ws]);
    //


    return {
        pins, setPins,
    };
}
