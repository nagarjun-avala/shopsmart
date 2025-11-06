import React from 'react';
import Icon from '@/components/AppIcon';
import { formatCurrency } from '@/lib/currency';
import { ShoppingItemType } from '@/types/all';

interface Category {
    id: string;
    name: string;
}

interface StatItem {
    label: string;
    value: number;
    icon: string;
    color: string;
    bgColor: string;
}

interface ShoppingStatsProps {
    items: ShoppingItemType[];
    categories: Category[];
}

const ShoppingStats: React.FC<ShoppingStatsProps> = ({ items, categories }) => {
    const totalItems = items.length;
    const completedItems = items.filter(item => item.completed).length;
    const pendingItems = totalItems - completedItems;
    const highPriorityItems = items.filter(item => item.priority === 'high' && !item.completed).length;

    const totalEstimatedCost = items.reduce((sum, item) => {
        return sum + ((item.estimatedPrice || 0) * (item.quantity || 1));
    }, 0);

    const completedCost = items
        .filter(item => item.completed)
        .reduce((sum, item) => {
            return sum + ((item.estimatedPrice || 0) * (item.quantity || 1));
        }, 0);

    const stats: StatItem[] = [
        {
            label: 'Total Items',
            value: totalItems,
            icon: 'Package',
            color: 'text-primary',
            bgColor: 'bg-muted'
        },
        {
            label: 'Completed',
            value: completedItems,
            icon: 'CheckCircle',
            color: 'text-success',
            bgColor: 'bg-success/10'
        },
        {
            label: 'Remaining',
            value: pendingItems,
            icon: 'Circle',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        },
        {
            label: 'High Priority',
            value: highPriorityItems,
            icon: 'AlertTriangle',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-600/10'
        }
    ];

    return (
        <div className="bg-surface border-b border-border p-6">
            <div className="max-w-4xl mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="breathing-card bg-card rounded-lg p-4 border border-border">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                    <Icon name={stat.icon} size={20} className={stat.color} />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cost Summary */}
                {totalEstimatedCost > 0 && (
                    <div className="breathing-card bg-linear-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg p-4 border border-brand-primary/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Icon name="IndianRupee" size={20} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Estimated Total</p>
                                    <p className="text-xl font-semibold text-primary">
                                        {formatCurrency(totalEstimatedCost)}
                                    </p>
                                </div>
                            </div>

                            {completedCost > 0 && (
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Spent So Far</p>
                                    <p className="text-lg font-medium text-success">
                                        {formatCurrency(completedCost)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Insights */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {pendingItems > 0 && (
                        <div className="inline-flex items-center space-x-1 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-sm">
                            <Icon name="ShoppingCart" size={14} />
                            <span>{pendingItems} items to collect</span>
                        </div>
                    )}

                    {highPriorityItems > 0 && (
                        <div className="inline-flex items-center space-x-1 bg-warning/10 text-yellow-600 px-3 py-1 rounded-full text-sm">
                            <Icon name="AlertTriangle" size={14} />
                            <span>{highPriorityItems} priority items</span>
                        </div>
                    )}

                    {categories.length > 0 && (
                        <div className="inline-flex items-center space-x-1 bg-muted text-text-secondary px-3 py-1 rounded-full text-sm">
                            <Icon name="FolderOpen" size={14} />
                            <span>{categories.length} categories</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoppingStats;