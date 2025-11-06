import React from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import { Activity } from '@/types/all';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'list_created': return 'Plus';
      case 'item_added': return 'ShoppingCart';
      case 'item_completed': return 'CheckCircle';
      case 'list_shared': return 'Share';
      case 'member_joined': return 'UserPlus';
      case 'comment_added': return 'MessageCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'list_created': return 'text-green-600';
      case 'item_added': return 'text-blue-600';
      case 'item_completed': return 'text-emerald-600';
      case 'list_shared': return 'text-purple-600';
      case 'member_joined': return 'text-amber-600';
      case 'comment_added': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const activityTime = timestamp;
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Activity" size={20} className="text-brand-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Family Activity</h2>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 calm-transition">
            <div className="relative shrink-0">
              <Image
                src={activity?.user?.avatar}
                alt={activity?.user?.avatarAlt}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-soft`}>
                <Icon
                  name={getActivityIcon(activity?.type)}
                  size={12}
                  className={getActivityColor(activity?.type)}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{activity?.user?.name}</span>
                  <span className="text-text-secondary ml-1">{activity?.action}</span>
                  {activity?.target && (
                    <span className="font-medium text-text-primary ml-1">&ldquo;{activity?.target}&ldquo;</span>
                  )}
                </p>
                <span className="text-xs text-text-secondary shrink-0">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>

              {activity?.details && (
                <p className="text-xs text-text-secondary">{activity?.details}</p>
              )}

              {activity?.listName && (
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="List" size={12} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary">in {activity?.listName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <button className="text-sm text-brand-primary hover:text-brand-primary/80 calm-transition">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;