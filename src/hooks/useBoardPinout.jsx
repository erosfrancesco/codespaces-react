import React, { createContext, useContext, useState } from 'react';
import { useWSMessages } from './useWebSocket';

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
    const [name, setName] = useState("");

    useWSMessages((data) => {
        if (data.type === 'config') {
            console.log('got config from ws: ', data);
            const {
                device_name,
                gpio_pins
            } = data.config;

            setName(device_name);
            setPins(gpio_pins);
        }

        if (data.type === 'init' || data.type === 'state') {
            if ('gpio' in data) {
                setPins(data.gpio);
            }
        }
    }, (e) => console.error('[BOARD PINOUT]: Error:', e));

    return {
        name, pins
    };
}
