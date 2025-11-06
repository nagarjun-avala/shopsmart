import React from "react";
import Icon from "@/components/AppIcon";

interface CategoryStatsProps {
  stats: {
    totalCategories: number;
    mostUsedCategory: string;
    totalItems: number;
    averageItemsPerCategory: number;
  }
}

const CategoryStats = ({ stats }: CategoryStatsProps) => {
  const statItems = [
    {
      label: "Total Categories",
      value: stats?.totalCategories ?? 0,
      icon: "FolderOpen",
      color: "text-brand-primary",
      bgColor: "bg-brand-primary/10",
    },
    {
      label: "Most Used",
      value: stats?.mostUsedCategory ?? 0,
      icon: "TrendingUp",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Items Organized",
      value: stats?.totalItems ?? 0,
      icon: "Package",
      color: "text-brand-secondary",
      bgColor: "bg-brand-secondary/10",
    },
    {
      label: "Avg per Category",
      value: stats?.averageItemsPerCategory ?? 0,
      icon: "BarChart3",
      color: "text-conversion-accent",
      bgColor: "bg-conversion-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((item, index) => (
        <div
          key={index}
          className="breathing-card bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">
                {item?.label}
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {item?.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${item?.bgColor}`}
            >
              <Icon
                name={item?.icon}
                size={24}
                className={item?.color}
                strokeWidth={2}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStats;
