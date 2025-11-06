import React from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';

type SortValue = "category" | "name" | "priority" | "alphabetical" | "added";
type ViewMode = 'category' | 'list';

interface FilterOption {
    value: string;
    label: string;
    icon: string;
    count: number | null;
}

interface SortOption {
    value: SortValue;
    label: string;
    icon: string;
}

interface ViewModeOption {
    value: ViewMode;
    label: string;
    icon: string;
}

interface QuickFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    sortBy: SortValue;
    onSortChange: (sort: SortValue) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
    activeFilter,
    onFilterChange,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange
}) => {
    const filterOptions: FilterOption[] = [
        { value: 'all', label: 'All Items', icon: 'List', count: null },
        { value: 'pending', label: 'Pending', icon: 'Circle', count: null },
        { value: 'completed', label: 'Completed', icon: 'CheckCircle', count: null },
        { value: 'priority', label: 'Priority', icon: 'AlertTriangle', count: null }
    ];

    const sortOptions: SortOption[] = [
        { value: 'category', label: 'Category', icon: 'FolderOpen' },
        { value: 'priority', label: 'Priority', icon: 'AlertTriangle' },
        { value: 'alphabetical', label: 'A-Z', icon: 'ArrowUpDown' },
        { value: 'added', label: 'Recently Added', icon: 'Clock' }
    ];

    const viewModes: ViewModeOption[] = [
        { value: 'category', label: 'Category View', icon: 'Grid3x3' },
        { value: 'list', label: 'List View', icon: 'List' }
    ];

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(event.target.value as SortValue);
    };

    return (
        <div className="bg-surface border-b border-border p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    {/* Filters */}
                    <div className="flex items-center space-x-2 overflow-x-auto">
                        {filterOptions.map((filter) => (
                            <CustomeButton
                                key={filter.value}
                                variant={activeFilter === filter.value ? "default" : "outline"}
                                size="sm"
                                iconName={filter.icon}
                                iconPosition="left"
                                onClick={() => onFilterChange(filter.value)}
                                className="whitespace-nowrap"
                            >
                                {filter.label}
                            </CustomeButton>
                        ))}
                    </div>

                    {/* Sort and View Controls */}
                    <div className="flex items-center space-x-2">
                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="appearance-none bg-surface border border-border rounded-lg px-3 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <Icon
                                name="ChevronDown"
                                size={16}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-muted rounded-lg p-1">
                            {viewModes.map((mode) => (
                                <CustomeButton
                                    key={mode.value}
                                    variant={viewMode === mode.value ? "default" : "ghost"}
                                    size="icon"
                                    iconName={mode.icon}
                                    onClick={() => onViewModeChange(mode.value)}
                                    className="w-8 h-8"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Filter Indicator */}
                {activeFilter !== 'all' && (
                    <div className="flex items-center justify-between mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Icon name="Filter" size={16} className="text-primary" />
                            <span className="text-sm text-primary font-medium">
                                Showing {activeFilter} items
                            </span>
                        </div>
                        <CustomeButton
                            variant="ghost"
                            size="sm"
                            iconName="X"
                            onClick={() => onFilterChange('all')}
                            className="text-primary hover:text-primary/80"
                        >
                            Clear
                        </CustomeButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickFilters;