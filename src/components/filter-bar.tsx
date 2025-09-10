'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

export interface FilterState {
    orientation: 'landscape' | 'portrait' | 'square' | '';
    color: string;
    customColor: string;
    size: 'small' | 'medium' | 'large' | '';
}

interface FilterBarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}

const supportedColors = [
    { name: 'red', hex: '#ef4444' },
    { name: 'orange', hex: '#f97316' },
    { name: 'yellow', hex: '#eab308' },
    { name: 'green', hex: '#22c55e' },
    { name: 'turquoise', hex: '#06b6d4' },
    { name: 'blue', hex: '#3b82f6' },
    { name: 'violet', hex: '#8b5cf6' },
    { name: 'pink', hex: '#ec4899' },
    { name: 'brown', hex: '#a3a3a3' },
    { name: 'black', hex: '#000000' },
    { name: 'gray', hex: '#6b7280' },
    { name: 'white', hex: '#ffffff' },
];

const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
];

export default function FilterBar({ isOpen, onClose, filters, onFiltersChange }: FilterBarProps) {
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleCustomColorChange = (hex: string) => {
        const newFilters = { ...localFilters, customColor: hex, color: hex };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters: FilterState = {
            orientation: '',
            color: '',
            customColor: '',
            size: '',
        };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Filter Bar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-base-300">
                        <h2 className="text-xl font-semibold">Filters</h2>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Orientation Filter */}
                        <div>
                            <label className="text-sm font-medium text-base-content mb-3 block">
                                Orientation
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'landscape', label: 'Landscape' },
                                    { value: 'portrait', label: 'Portrait' },
                                    { value: 'square', label: 'Square' },
                                ].map((option) => (
                                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="orientation"
                                            value={option.value}
                                            checked={localFilters.orientation === option.value}
                                            onChange={(e) => handleFilterChange('orientation', e.target.value)}
                                            className="radio radio-primary"
                                        />
                                        <span className="text-sm">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div>
                            <label className="text-sm font-medium text-base-content mb-3 block">
                                Color
                            </label>

                            {/* Color Swatches */}
                            <div className="grid grid-cols-6 gap-2 mb-4">
                                {supportedColors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => handleFilterChange('color', color.hex)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${localFilters.color === color.hex
                                            ? 'border-primary ring-2 ring-primary ring-offset-2'
                                            : 'border-base-300'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    >
                                        {localFilters.color === color.hex && (
                                            <Check className="w-4 h-4 text-white m-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Color Picker */}
                            <div className="space-y-2">
                                <label className="text-xs text-base-content/70">Custom Color</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={localFilters.customColor || '#000000'}
                                        onChange={(e) => handleCustomColorChange(e.target.value)}
                                        className="w-8 h-8 rounded border border-base-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        placeholder="#ffffff"
                                        value={localFilters.customColor}
                                        onChange={(e) => handleCustomColorChange(e.target.value)}
                                        className="input input-bordered input-sm flex-1"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <label className="text-sm font-medium text-base-content mb-3 block">
                                Minimum Size
                            </label>
                            <select
                                value={localFilters.size}
                                onChange={(e) => handleFilterChange('size', e.target.value)}
                                className="select select-bordered w-full"
                            >
                                <option value="">Any Size</option>
                                {sizeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-base-300 space-y-2">
                        <button
                            onClick={clearFilters}
                            className="btn btn-outline btn-sm w-full"
                        >
                            Clear All Filters
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-primary btn-sm w-full"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
