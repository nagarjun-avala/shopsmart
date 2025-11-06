import React from 'react';
import Icon from '@/components/AppIcon';

interface FamilyStatsCardProps {
  stats: {
    totalLists: number;
    activeMembers: number;
    itemsThisWeek: number;
    completedTasks: number
  }
}

const FamilyStatsCard = ({ stats }: FamilyStatsCardProps) => {
  const statItems = [
    {
      label: 'Total Lists',
      value: stats?.totalLists,
      icon: 'List',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Active Members',
      value: stats?.activeMembers,
      icon: 'Users',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Items This Week',
      value: stats?.itemsThisWeek,
      icon: 'ShoppingCart',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Completed Tasks',
      value: stats?.completedTasks,
      icon: 'CheckCircle',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="BarChart3" size={20} className="text-brand-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Family Overview</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {statItems?.map((item, index) => (
          <div key={index} className="breathing-card bg-muted/30 p-4 rounded-lg text-center">
            <div className={`w-12 h-12 ${item?.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">{item?.value}</div>
            <div className="text-sm text-text-secondary">{item?.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-green-600" />
            <span className="text-sm text-text-secondary">Family productivity up 23% this month</span>
          </div>
          <button className="text-sm text-brand-primary hover:text-brand-primary/80 calm-transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyStatsCard;