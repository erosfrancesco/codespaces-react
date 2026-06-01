export function GPIOPinsDisplay({ pin, state, timestamp }) {
    return (
        <div key={pin} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
            <div className="text-sm text-gray-600 uppercase tracking-wide mb-3">{getGPIOLabel(pin)}</div>
            <div className={`w-15 h-15 rounded-full mx-auto my-3 shadow-md ${state
                ? 'bg-linear-to-br from-green-400 to-green-600'
                : 'bg-linear-to-br from-red-400 to-red-600'}`}></div>
            <div className={`text-3xl font-bold my-4 min-h-15 flex items-center justify-center ${state
                ? 'text-green-500'
                : 'text-red-500'}`}>{getGPIOStateLabel(state)}</div>
            <div className="text-sm text-gray-500 mt-3">{timestamp}</div>
        </div>
    );
}


function getGPIOLabel(pin) {
    const labels = {
        '17': 'GPIO 17',
        '27': 'GPIO 27',
        '22': 'GPIO 22',
        '23': 'GPIO 23'
    };
    return labels[pin] || `GPIO ${pin}`;
}

function getGPIOStateLabel(state) {
    return state ? 'HIGH' : 'LOW';
}