import { GPIOPinsDisplay } from "../components/GpioPinsDisplay";
import { SerialDataDisplay } from "../components/SerialDataDisplay";
import { SectionContent, SectionTitle } from "../components/Layouts";
import { useSensors } from "../hooks/useSensors";
import { useBoardPinout } from "../hooks/useBoardPinout";


export function BoardPinoutSection() {
    const { pins } = useBoardPinout();
    const { serialData, timestamp } = useSensors();

    return <div className="mb-8">
        <SectionTitle>🔌 GPIO & Serial</SectionTitle>
        <SectionContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(pins).map(([pin, state]) =>
                <GPIOPinsDisplay key={pin} pin={pin} state={state} timestamp={timestamp} />
            )}
            <SerialDataDisplay serialData={serialData} timestamp={timestamp} />
        </SectionContent>
    </div>
}
