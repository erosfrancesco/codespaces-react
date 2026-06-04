import { ValueDisplay } from "../components/ValueDisplay";
import { SectionContent, SectionTitle } from "../components/Layouts";
import { useSensors } from "../hooks/useSensors";


// TODO: - Should use labeled sensors instead of hardcoded temperature/humidity
export function SensorsSection() {
    const { availableSensors } = useSensors();

    return (
        <div className="mb-8">
            <SectionTitle>📊 Sensors & Data</SectionTitle>
            <SectionContent className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3">
                {availableSensors.map(sensor => <SensorCard sensor={sensor} key={sensor} />)}
            </SectionContent>
        </div>
    );
}

function SensorCard({ sensor }) {
    const { sensorHistory } = useSensors();

    const { value, ...sensorProps } = sensorHistory[sensor] || { value: [] };
    const { min, max, avg } = calcStats(value);
    const current = value[value.length - 1] || 0;

    return <ValueDisplay
        label={sensorProps.label || sensor}
        value={current}
        unit={sensorProps.unit || ''}
        min={min}
        max={max}
        avg={avg}
    />
}

function calcStats(data) {
    if (!Array.isArray(data)) return { min: 0, max: 0, avg: 0 };
    if (data.length === 0) return { min: 0, max: 0, avg: 0 };

    return {
        min: Math.min(...data),
        max: Math.max(...data),
        avg: data.reduce((a, b) => a + b, 0) / data.length
    };
};
