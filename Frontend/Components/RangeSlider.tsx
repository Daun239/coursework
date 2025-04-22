import * as Slider from '@radix-ui/react-slider';
import React, { useState, useEffect } from 'react';

const RangeSlider = ({
    min,
    max,
    onRangeCommit,
    sliderName,
    currency,
}: {
    min: number;
    max: number;
    onRangeCommit?: (range: [number, number]) => void;
    sliderName: string,
    currency: string | null,
}) => {
    const [range, setRange] = useState<[number, number]>([min, max]);
    const [tempRange, setTempRange] = useState<[number, number]>([min, max]);

    useEffect(() => {
        // When min or max props change, update the state
        setRange([min, max]);
        setTempRange([min, max]);
    }, [min, max]); // Dependencies on min and max

    const handleValueChange = (newRange: [number, number]) => {
        setTempRange(newRange);
    };

    const handleValueCommit = () => {
        setRange(tempRange);
        onRangeCommit?.(tempRange); // Notify parent on commit
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium">
                {sliderName}: {range[0]} – {range[1]} {currency}
            </label>

            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                min={min}
                max={max}
                step={1}
                value={tempRange}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
            >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
                    <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-sm" />
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-sm" />
            </Slider.Root>

            <div className="flex justify-between text-sm text-gray-500">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default RangeSlider;
