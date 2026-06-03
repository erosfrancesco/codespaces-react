import React, { createContext, useContext, useState } from 'react';

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


// TODO: - 
export function useBoardPinout() {
    const [pins, setPins] = useState({});


    return {
        pins, setPins,
    };
}
