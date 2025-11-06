import React from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import { CustomeButton } from '@/components/ui/CustomeButton';
import { SharedListCardProps } from '@/types/all';


const SharedListCard = ({ list, onViewList, onEditList }: SharedListCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'ShoppingCart';
      case 'completed': return 'CheckCircle';
      case 'draft': return 'FileText';
      default: return 'List';
    }
  };

  return (
    <div className="breathing-card bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-text-primary">{list?.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(list?.status)}`}>
              <Icon name={getStatusIcon(list?.status)} size={12} className="inline mr-1" />
              {list?.status?.charAt(0)?.toUpperCase() + list?.status?.slice(1)}
            </span>
          </div>
          <p className="text-sm text-text-secondary mb-3">{list?.description}</p>

          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Package" size={14} />
              <span>{list?.totalItems} items</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={14} />
              <span>{list?.completedItems} completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{list?.lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <CustomeButton
            variant="outline"
            size="sm"
            iconName="Eye"
            onClick={() => onViewList(list)}
          >
            View
          </CustomeButton>
          <CustomeButton
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={() => onEditList(list)}
            className="text-text-secondary hover:text-text-primary"
          >
            Edit
          </CustomeButton>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-2">Contributors</h4>
          <div className="flex items-center space-x-2">
            {list?.contributors?.slice(0, 4)?.map((contributor, index) => (
              <div key={index} className="relative">
                <Image
                  src={contributor?.avatar}
                  alt={contributor?.avatarAlt}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
                {contributor?.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                )}
              </div>
            ))}
            {list?.contributors?.length > 4 && (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-text-secondary">
                  +{list?.contributors?.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="User" size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Created by {list?.createdBy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MessageCircle" size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{list?.comments} comments</span>
          </div>
        </div>

        {list?.recentActivity && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={14} className="text-brand-primary" />
              <span className="text-sm text-text-secondary">{list?.recentActivity}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedListCard;