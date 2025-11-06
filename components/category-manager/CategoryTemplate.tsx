import React from "react";
import Icon from "@/components/AppIcon";
import { CustomeButton } from "@/components/ui/CustomeButton";
import { CategoryTemplateData } from "@/types/all";

interface CategoryTemplateType {
  template: CategoryTemplateData;
  onApply: (template: CategoryTemplateData) => void;
  isApplying: boolean;
}

const CategoryTemplate = ({ template, onApply, isApplying = false }: CategoryTemplateType) => {
  return (
    <div className="breathing-card bg-card border border-border rounded-xl p-6">
      {/* Template Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-linear-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center shadow-soft">
            <Icon
              name={template?.icon}
              size={24}
              color="white"
              strokeWidth={2}
            />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-lg">
              {template?.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {template?.categoryCount} categories
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {template?.isPopular && (
            <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
              <Icon name="TrendingUp" size={12} className="mr-1" />
              Popular
            </span>
          )}
          {template?.isNew && (
            <span className="inline-flex items-center px-2 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-medium rounded-full">
              <Icon name="Sparkles" size={12} className="mr-1" />
              New
            </span>
          )}
        </div>
      </div>
      {/* Template Description */}
      <p className="text-text-secondary text-sm mb-4 leading-relaxed">
        {template?.description}
      </p>
      {/* Category Preview */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-text-primary">Includes:</h4>
        <div className="grid grid-cols-2 gap-2">
          {template?.categories?.slice(0, 6)?.map((category, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: category?.color }}
              >
                <Icon
                  name={category?.icon}
                  size={12}
                  color="white"
                  strokeWidth={2}
                />
              </div>
              <span className="text-text-secondary truncate">
                {category?.name}
              </span>
            </div>
          ))}
          {template?.categories?.length > 6 && (
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                <Icon name="Plus" size={12} className="text-text-secondary" />
              </div>
              <span className="text-text-secondary">
                +{template?.categories?.length - 6} more
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Usage Stats */}
      <div className="flex items-center justify-between text-sm mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-text-secondary">
            <Icon name="Users" size={14} />
            <span>{template?.usedBy} users</span>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary">
            <Icon name="Star" size={14} />
            <span>{template?.rating}</span>
          </div>
        </div>
        <div className="text-text-secondary">{template?.difficulty}</div>
      </div>
      {/* Apply Button */}
      <CustomeButton
        variant="outline"
        fullWidth
        iconName="Download"
        iconPosition="left"
        loading={isApplying}
        onClick={() => onApply(template)}
        className="border-primary/20 text-primary hover:bg-primary/5"
      >
        {isApplying ? "Applying..." : "Apply Template"}
      </CustomeButton>
    </div>
  );
};

export default CategoryTemplate;
