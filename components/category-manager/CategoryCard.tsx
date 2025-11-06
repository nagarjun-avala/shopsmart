import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import { CustomeButton } from "@/components/ui/CustomeButton";
import { CategoryType } from "@/types/all";

interface CategoryCardType {
  category: CategoryType;
  onEdit: (category: CategoryType) => void;
  onDelete: (id: string) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}


const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: CategoryCardType) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e?.dataTransfer?.setData("text/plain", category?.id);
    onDragStart?.(category?.id);
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        breathing-card bg-card border border-border rounded-xl p-6 cursor-move calm-transition
        ${isDragging ? "opacity-50 scale-95" : "hover:shadow-gentle"}
        ${isHovered ? "ring-2 ring-primary/20" : ""}
      `}
    >
      {/* Category Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-soft"
            style={{ backgroundColor: category?.color }}
          >
            <Icon
              name={category?.icon}
              size={24}
              color="white"
              strokeWidth={2}
            />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-lg">
              {category?.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {category?.itemCount} items
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex items-center space-x-1 calm-transition ${isHovered ? "opacity-100" : "opacity-0"
            }`}
        >
          <CustomeButton
            variant="ghost"
            size="icon"
            iconName="Edit2"
            onClick={() => onEdit(category)}
            className="text-text-secondary hover:text-primary"
          />
          <CustomeButton
            variant="ghost"
            size="icon"
            iconName="Trash2"
            onClick={() => onDelete(category?.id)}
            className="text-text-secondary hover:text-destructive"
          />
        </div>
      </div>
      {/* Category Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Usage frequency</span>
          <span className="font-medium text-text-primary">
            {category?.frequency}
          </span>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="h-2 rounded-full calm-transition"
            style={{
              width: `${category?.usagePercentage}%`,
              backgroundColor: category?.color,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Last used</span>
          <span className="font-medium text-text-primary">
            {category?.lastUsed}
          </span>
        </div>
      </div>
      {/* Recent Items Preview */}
      {category?.recentItems && category?.recentItems?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-text-secondary mb-2">
            Recent items:
          </p>
          <div className="flex flex-wrap gap-1">
            {category?.recentItems?.slice(0, 3)?.map((item, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-muted rounded text-xs text-text-secondary"
              >
                {item}
              </span>
            ))}
            {category?.recentItems?.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs text-text-secondary">
                +{category?.recentItems?.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
