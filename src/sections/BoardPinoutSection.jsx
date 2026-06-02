import { GPIOPinsDisplay } from "../components/GpioPinsDisplay";
import { SerialDataDisplay } from "../components/SerialDataDisplay";
import { SectionContent, SectionTitle } from "../components/Layouts";


export function BoardPinoutSection({ pins, serialData, timestamp }) {
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
