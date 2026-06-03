import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocketConnection } from './useWebSocket';

const SensorsContext = createContext(null);

export function SensorsProvider({ children }) {
    const value = useSensors();

    return (
        <SensorsContext.Provider value={value}>
            {children}
        </SensorsContext.Provider>
    );
}

export function useSensorsContext() {
    const context = useContext(SensorsContext);

    if (!context) {
        throw new Error(
            'useSensors must be used within a SensorsProvider'
        );
    }

    return context;
}

export function useSensors() {
    const [serialData, setSerialData] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [sensorHistory, setSensorHistory] = useState({ timestamps: [] });

    function updateSensors(prev, data) {
        const timestamps = [...prev.timestamps, data.timestamp].slice(-60);

        const sensors = Object.keys(data.sensors);
        const values = sensors.reduce((acc, sensor) => {
            const { value, ...props } = data.sensors[sensor];
            acc[sensor] = prev[sensor] || {
                ...props,
                value: []
            };

            acc[sensor].value = [...acc[sensor].value, value].slice(-60);

            return acc;
        }, {});

        return {
            ...values,
            timestamps
        };
    }


    // WS integration
    const { ws } = useWebSocketConnection();

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = event => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'init' || data.type === 'state') {
                    if ('serial' in data) {
                        setSerialData(data.serial);
                    }

                    if (data.timestamp) {
                        setTimestamp(new Date(data.timestamp).toLocaleTimeString());
                    }

                    if (data.sensors) {
                        setSensorHistory((prev) => updateSensors(prev, data));
                    }
                }
            } catch (e) {
                console.error('[USESENSORS] Error parsing message:', e);
            }
        };

        ws.current.onerror = error => {
            console.error('[USESENSORS] WebSocket error:', error);
        };
    }, [ws]);
    //


    return {
        serialData, setSerialData,
        timestamp, setTimestamp,
        sensorHistory, setSensorHistory,
        updateSensors
    };
}
