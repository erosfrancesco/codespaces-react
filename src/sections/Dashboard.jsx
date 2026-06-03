import React, { useState } from "react";

import { ConnectionSection } from "./ConnectionSection";
import { BoardPinoutSection } from "./BoardPinoutSection";
import { SensorsSection } from "./SensorsSection";
import { ChartsSection } from "./ChartsSection";
import { useSensors } from "../hooks/useSensors";

export function Dashboard() {
    const [pins, setPins] = useState({});

    const {
        serialData,
        sensorHistory,
        timestamp
    } = useSensors();

    // TODO: - use config_store set and get for board management
    const onData = data => {
        if (data.type === 'init' || data.type === 'state') {
            if ('gpio' in data) {
                setPins(data.gpio);
            }
        }
    }

    const onError = error => {
        console.error('WebSocket error:', error);
    }

    return (
        <div className="max-w-4xl mx-auto text-center">
            <ConnectionSection onData={onData} onError={onError} />
            <BoardPinoutSection pins={pins} serialData={serialData} timestamp={timestamp} />
            <SensorsSection sensorHistory={sensorHistory} />
            <ChartsSection sensorHistory={sensorHistory} />
        </div>
    );
}
