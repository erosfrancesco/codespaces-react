import { Card } from "./Layouts";

export function ValueDisplay({ label, value, unit, min, max, avg }) {
    return (
        <Card>
            <div className="text-sm text-gray-600 uppercase tracking-wider mb-4">{label}</div>
            <div className="text-5xl font-bold mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{value.toFixed(2)}</div>
            {unit && <div className="text-lg text-gray-500 mt-1">{unit}</div>}
            {(min !== undefined || max !== undefined || avg !== undefined) && (
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
                    {min !== undefined && (
                        <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Min</div>
                            <div className="text-xl font-bold text-gray-800">{min.toFixed(1)}</div>
                        </div>
                    )}
                    {avg !== undefined && (
                        <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Avg</div>
                            <div className="text-xl font-bold text-gray-800">{avg.toFixed(1)}</div>
                        </div>
                    )}
                    {max !== undefined && (
                        <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Max</div>
                            <div className="text-xl font-bold text-gray-800">{max.toFixed(1)}</div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
