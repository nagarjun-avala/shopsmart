"use client";
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';
import CustomeInput from '@/components/ui/CustomeInput';
import CustomeSelect from '../ui/customeSelect';

interface HistoryFiltersProps {
  onFilterChange?: (filter: string) => void;
  onSearch?: (searchTerm: string) => void;
}

const HistoryFilters: React.FC<HistoryFiltersProps> = ({ onFilterChange, onSearch }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filterOptions = [
    { id: 'all', label: 'All Trips', icon: 'Calendar' },
    { id: 'week', label: 'This Week', icon: 'CalendarDays' },
    { id: 'month', label: 'This Month', icon: 'Calendar' },
    { id: 'quarter', label: 'Last 3 Months', icon: 'CalendarRange' },
    { id: 'year', label: 'This Year', icon: 'CalendarCheck' }
  ];

  const storeFilters = [
    { value: 'all-stores', label: 'All Stores' },
    { value: 'walmart', label: 'Walmart' },
    { value: 'target', label: 'Target' },
    { value: 'kroger', label: 'Kroger' },
    { value: 'costco', label: 'Costco' }
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
    onFilterChange?.('all');
    onSearch?.('');
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Search History</label>
        <div className="relative">
          <Icon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          />
          <CustomeInput
            type="search"
            placeholder="Search items, stores, or dates..."
            value={searchTerm}
            onChange={(e) => handleSearch(e?.target?.value)}
            className="pl-10"
          />
        </div>
      </div>
      {/* Time Period Filters */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">Time Period</label>
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((filter) => (
            <CustomeButton
              key={filter?.id}
              variant={activeFilter === filter?.id ? 'default' : 'outline'}
              size="sm"
              iconName={filter?.icon}
              iconPosition="left"
              onClick={() => handleFilterClick(filter?.id)}
              className="text-xs"
            >
              {filter?.label}
            </CustomeButton>
          ))}
        </div>
      </div>
      {/* Custom Date Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">Custom Date Range</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomeInput
            type="date"
            label="Start Date"
            value={dateRange?.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e?.target?.value }))}
          />
          <CustomeInput
            type="date"
            label="End Date"
            value={dateRange?.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e?.target?.value }))}
          />
        </div>
      </div>
      {/* Store Filter */}
      <div className="space-y-3">
        <CustomeSelect value="all-stores"
          label='Store'
          onChange={() => { }}
          options={storeFilters}
        ></CustomeSelect>
      </div>
      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <CustomeInput
            type="number"
            placeholder="Min $"
            min="0"
            step="0.01"
          />
          <CustomeInput
            type="number"
            placeholder="Max $"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col flex-wrap sm:flex-row gap-3 pt-4 border-t border-border">
        <CustomeButton
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={clearFilters}
          className="flex-1"
        >
          Clear Filters
        </CustomeButton>
        <CustomeButton
          variant="default"
          iconName="Download"
          iconPosition="left"
          className="flex-1"
        >
          Export Data
        </CustomeButton>
      </div>
    </div>
  );
};

export default HistoryFilters;