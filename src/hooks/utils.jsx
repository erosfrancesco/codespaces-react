import React from "react";


export function calcStats(data) {
    if (!Array.isArray(data)) return { min: 0, max: 0, avg: 0 };
    if (data.length === 0) return { min: 0, max: 0, avg: 0 };

    return {
        min: Math.min(...data),
        max: Math.max(...data),
        avg: data.reduce((a, b) => a + b, 0) / data.length
    };
};
