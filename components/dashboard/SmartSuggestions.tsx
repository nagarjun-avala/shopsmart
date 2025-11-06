"use client";

import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import { formatCurrency } from "@/lib/currency";
import { CustomeButton } from "@/components/ui/CustomeButton";

interface SmartSuggestionsProps {
    suggestions?: {
        id: string;
        item: string;
        reason: string;
        confidence: number;
        category: string;
        lastBought: string;
        avgPrice: number;
    }[]
    loading?: boolean
}

const SmartSuggestions = ({ suggestions = [], loading = false }: SmartSuggestionsProps) => {
    const [addedItems, setAddedItems] = useState(new Set());

    const handleAddItem = (itemId: string) => {
        setAddedItems((prev) => new Set([...prev, itemId]));
        // TODO: Implement actual add to list functionality
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "dairy":
                return "Milk";
            case "produce":
                return "Apple";
            case "bakery":
                return "Wheat";
            case "meat":
                return "Beef";
            default:
                return "Package";
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 90) return "text-success";
        if (confidence >= 75) return "text-warning";
        return "text-gray-500";
    };

    return (
        <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="Sparkles" size={20} className="text-blue-500" />
                    <h2 className="text-lg font-semibold text-primary">
                        Smart Suggestions
                    </h2>
                </div>
                <div className="text-xs text-gray-500 bg-blue-500/10 px-2 py-1 rounded-full">
                    AI Powered
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="border border-border p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                                            <div className="h-3 bg-gray-300 rounded w-32 mb-1"></div>
                                            <div className="h-3 bg-gray-300 rounded w-20"></div>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {suggestions.length === 0 ? (
                        <div className="text-center py-8">
                            <Icon name="Sparkles" size={48} className="text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No suggestions available yet</p>
                            <p className="text-sm text-gray-400">Suggestions will appear based on your shopping patterns</p>
                        </div>
                    ) : (
                        suggestions.map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="breathing-card border border-border p-4  hover:border-blue-500/30 hover:shadow-xl shadow-blue-300/10 hover:scale-102 transition-all ease-in-out duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                            <Icon
                                                name={getCategoryIcon(suggestion.category)}
                                                size={18}
                                                className="text-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-medium text-primary">
                                                    {suggestion.item}
                                                </h3>
                                                <span
                                                    className={`text-xs font-medium ${getConfidenceColor(
                                                        suggestion.confidence
                                                    )}`}
                                                >
                                                    {suggestion.confidence}%
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                {suggestion.reason}
                                            </p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span>Last: {suggestion.lastBought}</span>
                                                <span>•</span>
                                                <span>Avg: {formatCurrency(suggestion.avgPrice)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        {addedItems.has(suggestion.id) ? (
                                            <CustomeButton variant="default" size="sm" iconName="Check" disabled>
                                                Added
                                            </CustomeButton>
                                        ) : (
                                            <CustomeButton
                                                variant="outline"
                                                size="sm"
                                                iconName="Plus"
                                                onClick={() => handleAddItem(suggestion.id)}
                                            >
                                                Add
                                            </CustomeButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Icon name="TrendingUp" size={16} />
                        <span>Based on your shopping patterns</span>
                    </div>
                    <CustomeButton variant="ghost" size="sm" iconName="RefreshCw">
                        Refresh
                    </CustomeButton>
                </div>
            </div>
        </div>
    );
};

export default SmartSuggestions;
