import React from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';

interface QuickActionProps {
  onCreateList: () => void;
  onInviteMember: () => void;
  onStartShopping: () => void;
  onViewHistory: () => void;
}

const QuickActions = ({ onCreateList, onInviteMember, onStartShopping, onViewHistory }: QuickActionProps) => {
  const actions = [
    {
      label: 'Create New List',
      description: 'Start a new shopping list for the family',
      icon: 'Plus',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      onClick: onCreateList
    },
    {
      label: 'Invite Member',
      description: 'Add a new family member to the hub',
      icon: 'UserPlus',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      onClick: onInviteMember
    },
    {
      label: 'Start Shopping',
      description: 'Begin shopping with active lists',
      icon: 'ShoppingCart',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      onClick: onStartShopping
    },
    {
      label: 'View History',
      description: 'Check past shopping activities',
      icon: 'History',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      onClick: onViewHistory
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Zap" size={20} className="text-brand-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {actions?.map((action, index) => (
          <button
            key={index}
            onClick={action?.onClick}
            className="breathing-card bg-muted/30 p-4 rounded-lg text-left hover:bg-muted/50 calm-transition group"
          >
            <div className={`w-12 h-12 ${action?.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 spring-bounce`}>
              <Icon name={action?.icon} size={20} className={action?.color} />
            </div>
            <h3 className="font-medium text-text-primary mb-1 group-hover:text-brand-primary calm-transition">
              {action?.label}
            </h3>
            <p className="text-sm text-text-secondary">{action?.description}</p>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} className="text-amber-500" />
            <span className="text-sm text-text-secondary">
              Tip: Use voice commands to quickly add items while cooking
            </span>
          </div>
          <CustomeButton variant="ghost" size="sm" iconName="HelpCircle">
            Learn More
          </CustomeButton>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;