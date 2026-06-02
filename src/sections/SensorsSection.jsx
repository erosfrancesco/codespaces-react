import { calcStats } from "../hooks/utils";
import { ValueDisplay } from "../components/ValueDisplay";
import { SectionContent, SectionTitle } from "../components/Layouts";


// TODO: - Should use labeled sensors instead of hardcoded temperature/humidity
export function SensorsSection({ sensorHistory }) {
    const sensors = Object.keys(sensorHistory).filter(s => s !== 'timestamps');

    return (
        <div className="mb-8">
            <SectionTitle>📊 Sensors & Data</SectionTitle>
            <SectionContent>
                {sensors.map(sensor => {
                    const { value, ...sensorProps } = sensorHistory[sensor] || { value: [] };
                    const { min, max, avg } = calcStats(value);
                    const current = value[value.length - 1] || 0;

                    return <ValueDisplay
                        key={sensor}
                        label={sensorProps.label || sensor}
                        value={current}
                        unit={sensorProps.unit || ''}
                        min={min}
                        max={max}
                        avg={avg}
                    />
                })}

            </SectionContent>
        </div>
    );
}
