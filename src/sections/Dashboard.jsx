import React, { useState } from "react";

import { ConnectionSection } from "./ConnectionSection";
import { BoardPinoutSection } from "./BoardPinoutSection";
import { SensorsSection } from "./SensorsSection";
import { ChartsSection } from "./ChartsSection";
import { useSensors } from "../hooks/useSensors";
import { useBoardPinout } from "../hooks/useBoardPinout";

export function Dashboard() {
    const { pins } = useBoardPinout();
    const {
        serialData,
        sensorHistory,
        timestamp
    } = useSensors();


    return (
        <div className="max-w-4xl mx-auto text-center">
            <ConnectionSection />
            <BoardPinoutSection pins={pins} serialData={serialData} timestamp={timestamp} />
            <SensorsSection sensorHistory={sensorHistory} />
            <ChartsSection sensorHistory={sensorHistory} />
        </div>
    );
}
