import React from 'react';
import Icon from '@/components/AppIcon';
import { formatCurrency } from '@/lib/currency';

const HistoryStats = () => {

  const stats = [
    {
      label: 'Total Spent This Month',
      value: 1247.89,
      icon: 'DollarSign',
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Average Per Trip',
      value: 62.39,
      icon: 'ShoppingCart',
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '-3%',
      trendUp: false
    },
    {
      label: 'Most Expensive Item',
      value: 89.99,
      icon: 'TrendingUp',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: 'Organic Steak'
    },
    {
      label: 'Money Saved',
      value: 156.32,
      icon: 'PiggyBank',
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+8%',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>

            {stat?.trend && (
              <div className={`flex items-center space-x-1 text-sm ${stat?.trendUp === true ? 'text-success' :
                stat?.trendUp === false ? 'text-red-500' : 'text-gray-500'
                }`}>
                {stat?.trendUp !== undefined && (
                  <Icon
                    name={stat?.trendUp ? 'TrendingUp' : 'TrendingDown'}
                    size={16}
                  />
                )}
                <span>{stat?.trend}</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-2xl font-bold text-text-primary mb-1">{formatCurrency(stat?.value)}</p>
            <p className="text-sm text-text-secondary">{stat?.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryStats;