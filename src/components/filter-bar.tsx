"use client";

import { ListFilter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
];

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

export default function FilterBar() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        orientation: '',
        color: '',
        size: '',
    });

    const appliedFiltersCount = Object.values(formData).filter(Boolean).length;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        setFormData(newFormData);
        updateSearchParams(newFormData);
    };

    const updateSearchParams = (data: typeof formData) => {
        const params = new URLSearchParams(searchParams);

        if (data.orientation) {
            params.set('orientation', data.orientation);
        } else {
            params.delete('orientation');
        }

        if (data.color) {
            const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(data.color);
            if (isValidHex) {
                params.set('color', data.color.replace('#', '').toUpperCase());
            }
        } else {
            params.delete('color');
        }

        if (data.size) {
            params.set('size', data.size);
        } else {
            params.delete('size');
        }

        router.replace(`${pathname}?${params.toString()}`);
    };


    useEffect(() => {
        setFormData({
            orientation: searchParams.get("orientation") || "",
            color: searchParams.get("color") ? `#${searchParams.get("color")}` : "",
            size: searchParams.get("size") || "",
        });
    }, [searchParams]);

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <label htmlFor="my-drawer" className="btn btn-primary btn-soft drawer-button">
                    <ListFilter className="w-4 h-4" />
                    Filters
                    {appliedFiltersCount > 0 && (
                        <div className="badge badge-sm badge-primary">{appliedFiltersCount.toString().padStart(2, "0")}</div>
                    )}
                </label>
            </div>
            <div className="drawer-side z-30">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="bg-base-200 text-base-content min-h-full w-80 p-4">
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-base-300">
                            <h2 className="text-xl font-semibold">Filters</h2>
                            <label
                                htmlFor="my-drawer"
                                className="btn btn-sm btn-ghost btn-circle"
                                aria-label="close sidebar"
                            >
                                <X className="w-5 h-5" />
                            </label>
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
                                        { value: '', label: 'Any' },
                                        { value: 'landscape', label: 'Landscape' },
                                        { value: 'portrait', label: 'Portrait' },
                                        { value: 'square', label: 'Square' },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                name="orientation"
                                                onChange={handleChange}
                                                checked={formData.orientation === option.value}
                                                type="radio"
                                                value={option.value}
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
                                            onClick={() => {
                                                const newFormData = { ...formData, color: color.hex };
                                                setFormData(newFormData);
                                                updateSearchParams(newFormData);
                                            }}
                                            key={color.name}
                                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${formData.color === color.hex ? 'ring-2 ring-primary ring-offset-2' : ''
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Color Picker */}
                                <div className="space-y-2">
                                    <label className="text-xs text-base-content/70">Custom Color</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            name="color"
                                            onChange={handleChange}
                                            value={formData.color.toUpperCase()}
                                            type="color"
                                            className="w-8 h-8 rounded border border-base-300 cursor-pointer"
                                        />
                                        <div className="relative flex-1">
                                            <input
                                                name="color"
                                                type="text"
                                                onChange={handleChange}
                                                value={formData.color.toUpperCase()}
                                                placeholder="Enter hex code"
                                                className="input input-bordered input-sm w-full pr-8"
                                                pattern="^#[0-9A-Fa-f]{6}$"
                                            />
                                            {formData.color && (
                                                <button
                                                    onClick={() => {
                                                        const newFormData = { ...formData, color: '' };
                                                        setFormData(newFormData);
                                                        updateSearchParams(newFormData);
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full text-base-content/70 hover:text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-base-300"
                                                    title="Clear color"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Size Filter */}
                            <div>
                                <label className="text-sm font-medium text-base-content mb-3 block">
                                    Minimum Size
                                </label>
                                <select
                                    name="size"
                                    onChange={handleChange}
                                    value={formData.size}
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
                    </div>
                </div>
            </div>
        </div>
    )
}