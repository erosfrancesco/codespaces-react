import React, { createContext, useContext, useState } from 'react';
import { useWSMessages } from './useWebSocket';

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
    const [availableSensors, setAvailableSensors] = useState([]);

    function updateSensors(prev, data) {
        const sensors = Object.keys(data.sensors);

        return sensors.reduce((acc, sensor) => {
            const { value, ...configs } = data.sensors[sensor];
            acc[sensor] = prev[sensor] || {
                ...configs,
                value: []
            };

            acc[sensor].value = [...acc[sensor].value, value].slice(-60);

            return acc;
        }, {});
    }

    function updateTimestamps(prev, data) {
        const timestamps = [...prev.timestamps, data.timestamp].slice(-60);

        return {
            timestamps
        };
    }

    useWSMessages((data) => {
        if (data.type === 'init' || data.type === 'state') {
            if ('serial' in data) {
                setSerialData(data.serial);
            }

            if (data.timestamp) {
                setTimestamp(new Date(data.timestamp).toLocaleTimeString());
            }

            if (data.sensors) {
                setAvailableSensors(Object.keys(data.sensors));

                setSensorHistory((prev) => {
                    return {
                        ...updateSensors(prev, data),
                        ...updateTimestamps(prev, data)
                    }
                });
            }
        }
    }, (e) => console.error('[SENSORS]: Error:', e));

    return {
        serialData, setSerialData,
        timestamp, setTimestamp,
        sensorHistory, setSensorHistory,
        availableSensors
    };
}
