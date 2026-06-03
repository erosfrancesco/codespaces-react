import React, { useState } from "react";

import { ConnectionSection } from "./ConnectionSection";
import { BoardPinoutSection } from "./BoardPinoutSection";
import { SensorsSection } from "./SensorsSection";
import { ChartsSection } from "./ChartsSection";

export function Dashboard() {
    return (
        <div className="max-w-4xl mx-auto text-center">
            <ConnectionSection />
            <BoardPinoutSection />
            <SensorsSection />
            <ChartsSection />
        </div>
    );
}
