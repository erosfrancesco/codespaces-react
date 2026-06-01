export function SerialDataDisplay({ serialData, timestamp }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-full">
            <div className="text-lg font-semibold text-gray-800 mb-4">📡 Serial Data</div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 font-mono max-h-48 overflow-y-auto text-gray-800 text-sm leading-relaxed break-all whitespace-pre-wrap">
                {serialData || <span className="text-gray-500 italic">No data received...</span>}
            </div>
            <div className="text-sm text-gray-500 mt-3">{timestamp}</div>
        </div>
    );
}