import { GPIOPinsDisplay } from "../components/GpioPinsDisplay";
import { SerialDataDisplay } from "../components/SerialDataDisplay";
import { SectionContent, SectionTitle } from "../components/Layouts";


export function BoardPinoutSection({ pins, serialData, timestamp }) { 
    return <div className="mb-8">
        <SectionTitle>🔌 GPIO & Serial</SectionTitle>
        <SectionContent>
            {Object.entries(pins).map(([pin, state]) =>
                <GPIOPinsDisplay pin={pin} state={state} timestamp={timestamp} />
            )}
            <SerialDataDisplay serialData={serialData} timestamp={timestamp} />
        </SectionContent>
    </div>
}
