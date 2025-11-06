import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '@/components/AppIcon';
import { formatCurrency } from '@/lib/currency';

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
  [key: string]: unknown;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryData }> }) => {
  if (active && payload && payload?.length) {
    const data = payload?.[0]?.payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-gentle">
        <div className="flex items-center space-x-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data?.color }}
          ></div>
          <span className="font-medium text-text-primary">{data?.name}</span>
        </div>
        <p className="text-sm text-text-secondary">
          {formatCurrency(data?.value)} ({data?.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CategoryBreakdown = () => {
  const categoryData: CategoryData[] = [
    { name: 'Produce', value: 285, percentage: 24, color: '#10B981', icon: 'Apple' },
    { name: 'Meat & Seafood', value: 340, percentage: 29, color: '#EF4444', icon: 'Fish' },
    { name: 'Dairy', value: 180, percentage: 15, color: '#3B82F6', icon: 'Milk' },
    { name: 'Pantry', value: 145, percentage: 12, color: '#F59E0B', icon: 'Package' },
    { name: 'Bakery', value: 95, percentage: 8, color: '#8B5CF6', icon: 'Cookie' },
    { name: 'Frozen', value: 85, percentage: 7, color: '#06B6D4', icon: 'Snowflake' },
    { name: 'Other', value: 60, percentage: 5, color: '#6B7280', icon: 'MoreHorizontal' }
  ];

  const totalSpent = categoryData?.reduce((sum, category) => sum + category?.value, 0);

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Spending by Category</h3>
          <p className="text-sm text-text-secondary">Last 30 days breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalSpent)}</p>
          <p className="text-sm text-text-secondary">Total Spent</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="w-full h-64" aria-label="Category Spending Pie Chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData?.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {categoryData?.map((category) => (
            <div key={category?.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted calm-transition">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: category?.color }}
                ></div>
                <div className="flex items-center space-x-2">
                  <Icon name={category?.icon} size={18} className="text-text-secondary" />
                  <span className="font-medium text-text-primary">{category?.name}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-text-primary">{formatCurrency(category?.value)}</p>
                <p className="text-sm text-text-secondary">{category?.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-medium text-text-primary mb-3">Spending Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Highest Category</span>
            </div>
            <p className="text-sm text-blue-700">
              Meat & Seafood accounts for 29% of your spending
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Leaf" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Healthy Choice</span>
            </div>
            <p className="text-sm text-green-700">
              39% of spending on fresh produce & dairy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;