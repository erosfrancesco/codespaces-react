import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Card } from './Layouts';


export function LineChartWidget({
    label,
    data,
    timestamps,
    color = '#667eea',
    yMin,
    yMax,
    yLabel = ''
}) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    // Create chart once
    useEffect(() => {
        if (!canvasRef.current || chartRef.current) return;

        const ctx = canvasRef.current.getContext('2d');

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label,
                        data: [],
                        borderColor: color,
                        backgroundColor: color + '20',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: color,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }
                ]
            },
            options: {
                animation: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: yMin,
                        max: yMax,
                        ticks: {
                            callback: value =>
                                value + (yLabel ? ' ' + yLabel : '')
                        }
                    },
                    x: {
                        display: true,
                        ticks: {
                            maxTicksLimit: 6
                        }
                    }
                }
            }
        });

        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, []);

    // Update chart when data or config changes
    useEffect(() => {
        if (!chartRef.current) return;

        const chart = chartRef.current;

        chart.data.labels = timestamps.map(t =>
            new Date(t).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        );

        chart.data.datasets[0].label = label;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].borderColor = color;
        chart.data.datasets[0].backgroundColor = color + '20';
        chart.data.datasets[0].pointBackgroundColor = color;

        chart.options.scales.y.min = yMin;
        chart.options.scales.y.max = yMax;
        chart.options.scales.y.ticks.callback = value =>
            value + (yLabel ? ' ' + yLabel : '');

        chart.update('none'); // instant update, no animation
    }, [
        data,
        timestamps,
        label,
        color,
        yMin,
        yMax,
        yLabel
    ]);

    return (
        <Card>
            <div className="text-lg font-semibold text-gray-800 mb-2">
                {label}
            </div>

            {data.length > 0 ? (
                <div className="relative h-64 mb-2">
                    <canvas ref={canvasRef} />
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10 italic">
                    Waiting for data...
                </div>
            )}

            <div className="text-sm text-gray-600 text-center">
                {data.length > 0 &&
                    `${data.length} data points recorded`}
            </div>
        </Card>
    );
}