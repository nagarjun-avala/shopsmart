import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '@/lib/currency';

interface SpendingChartProps {
  data?: { month: string; spending: number; trips: number }[];
  chartType?: 'bar' | 'line';
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-gentle">
        <p className="text-sm font-medium text-text-primary">{`${label} 2024`}</p>
        <p className="text-sm text-brand-primary">
          {`Spending: ${formatCurrency(payload[0].value)}`}
        </p>
        {payload[1] && (
          <p className="text-sm text-brand-secondary">
            {`Trips: ${payload[1].value}`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const SpendingChart = ({ data, chartType = 'bar' }: SpendingChartProps) => {
  const defaultChartData = [
    { month: 'Jan', spending: 450, trips: 8 },
    { month: 'Feb', spending: 520, trips: 9 },
    { month: 'Mar', spending: 380, trips: 7 },
    { month: 'Apr', spending: 610, trips: 11 },
    { month: 'May', spending: 490, trips: 8 },
    { month: 'Jun', spending: 580, trips: 10 },
    { month: 'Jul', spending: 650, trips: 12 },
    { month: 'Aug', spending: 420, trips: 7 },
    { month: 'Sep', spending: 540, trips: 9 },
    { month: 'Oct', spending: 480, trips: 8 }
  ];

  const displayData = data || defaultChartData;

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Monthly Spending Trends</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Spending (INR)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-brand-secondary rounded-full"></div>
            <span className="text-sm text-text-secondary">Trips</span>
          </div>
        </div>
      </div>

      <div className="w-full h-80" aria-label="Monthly Spending Trends Chart">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="spending" fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="var(--color-brand-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-brand-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="trips"
                stroke="var(--color-brand-secondary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-brand-secondary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;