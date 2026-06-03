import { LineChartWidget } from "../components/LineChart";
import { SectionContent, SectionTitle } from "../components/Layouts";
import { useSensors } from "../hooks/useSensors";


export function ChartsSection() {
    const { sensorHistory } = useSensors();

    const sensors = Object.keys(sensorHistory).filter(s => s !== 'timestamps');
    const colorMap = ["#667eea", "#764ba2", "#ff6a00", "#ee0979", "#56ab2f", "#a8e063"];

    return (
        <div className="mb-8">
            <SectionTitle>📈 Charts</SectionTitle>
            <SectionContent className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3">
                {sensors.map((sensor, i) => {
                    const { value, ...sensorProps } = sensorHistory[sensor] || {};
                    const chartColor = colorMap[i] || colorMap[0];

                    return <LineChartWidget
                        key={sensor}
                        label={`${sensorProps.label || sensor} (Last 60s)`}
                        data={value || []}
                        timestamps={sensorHistory.timestamps}
                        color={sensorProps.color || chartColor}
                        yLabel={sensorProps.unit || ''}
                    />
                })}
            </SectionContent>
        </div>
    );
}
