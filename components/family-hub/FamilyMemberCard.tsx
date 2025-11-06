import React from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import { CustomeButton } from '@/components/ui/CustomeButton';
import { cn } from '@/lib/utils';

interface FamilyMemberCardProps {
  member: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    avatarAlt: string;
    role: 'admin' | 'editor' | 'viewer';
    isOnline: boolean;
    listsCreated: number;
    itemsAdded: number;
    lastActive: string;
    preferences?: string[];
  };
  onEditRole: (member: FamilyMemberCardProps['member']) => void;
  onRemove: (member: FamilyMemberCardProps['member']) => void;
  isCurrentUser: boolean;
}

const FamilyMemberCard = ({ member, onEditRole, onRemove, isCurrentUser }: FamilyMemberCardProps) => {

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'Crown';
      case 'editor': return 'Edit';
      case 'viewer': return 'Eye';
      default: return 'User';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-amber-600';
      case 'editor': return 'text-blue-600';
      case 'viewer': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-amber-100 text-amber-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="breathing-card bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Avatar and active status */}
          <div className="relative">
            <Image
              src={member?.avatar}
              alt={member?.avatarAlt}
              className="w-12 h-12 rounded-full object-cover"
            />
            {member?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          {/* Name,email and Role */}
          <div>
            <h3 className="font-semibold text-primary flex items-center space-x-2">
              <span
                className={cn(isCurrentUser && "text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full")}
              >{isCurrentUser ? "You" : member?.name}</span>
            </h3>
            <p className="text-sm text-secondary-foreground">{member?.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(member?.role)}`}>
                <Icon name={getRoleIcon(member?.role)} size={14} className={getRoleColor(member?.role)} />
                {member?.role?.charAt(0)?.toUpperCase() + member?.role?.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {!isCurrentUser && (
          <div className="flex items-center space-x-1">
            <CustomeButton
              variant="ghost"
              size="sm"
              iconName="Pencil"
              onClick={() => onEditRole(member)}
              className="text-blue-500 hover:text-primary"
            />
            <CustomeButton
              variant="ghost"
              size="sm"
              iconName="Trash2"
              onClick={() => onRemove(member)}
              className="text-red-500 hover:text-red-600"
            />
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-foreground">Lists Created</span>
          <span className="font-medium text-primary">{member?.listsCreated}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-foreground">Items Added</span>
          <span className="font-medium text-primary">{member?.itemsAdded}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-foreground">Last Active</span>
          <span className="font-medium text-primary">{member?.lastActive}</span>
        </div>
      </div>
      {member?.preferences && member?.preferences?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-primary mb-2">Shopping Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {member?.preferences?.map((pref, index) => (
              <span
                key={index}
                className="text-xs bg-muted text-secondary-foreground px-2 py-1 rounded-full"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyMemberCard;