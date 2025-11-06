"use client";
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';
import FamilyMemberCard from '@/components/family-hub/FamilyMemberCard';
import SharedListCard from '@/components/family-hub/SharedListCard';
import ActivityFeed from '@/components/family-hub/ActivityFeed';
import InviteMemberModal from '@/components/family-hub/InviteMemberModal';
import FamilyStatsCard from '@/components/family-hub/FamilyStatsCard';
import QuickActions from '@/components/family-hub/QuickActions';
import Link from 'next/link';
import { InviteData } from '@/types/all';

interface FamilyMember {
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
}

interface SharedList {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  totalItems: number;
  completedItems: number;
  lastUpdated: string;
  createdBy: string;
  comments: number;
  contributors: Array<{
    avatar: string;
    avatarAlt: string;
    isOnline: boolean;
  }>;
  recentActivity?: string;
}

const FamilyHub = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for family members
  const familyMembers: FamilyMember[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
      avatarAlt: "Professional woman with shoulder-length brown hair smiling at camera in white blazer",
      role: "admin",
      isOnline: true,
      listsCreated: 12,
      itemsAdded: 156,
      lastActive: "2 minutes ago",
      preferences: ["Organic", "Gluten-free", "Local brands"]
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "https://images.unsplash.com/photo-1597113113991-74221fab863e",
      avatarAlt: "Middle-aged man with short brown hair and beard in casual blue shirt outdoors",
      role: "editor",
      isOnline: false,
      listsCreated: 8,
      itemsAdded: 89,
      lastActive: "1 hour ago",
      preferences: ["Budget-friendly", "Bulk items"]
    },
    {
      id: 3,
      name: "Emma Johnson",
      email: "emma@example.com",
      avatar: "https://images.unsplash.com/photo-1732549681200-fe515b7d22dc",
      avatarAlt: "Young woman with long blonde hair smiling brightly in casual pink top",
      role: "viewer",
      isOnline: true,
      listsCreated: 2,
      itemsAdded: 34,
      lastActive: "5 minutes ago",
      preferences: ["Healthy snacks", "Dairy-free"]
    }];


  // Mock data for shared lists
  const sharedLists: SharedList[] = [
    {
      id: 1,
      name: "Weekly Groceries",
      description: "Our regular weekly shopping list with essentials and meal ingredients",
      status: "active",
      totalItems: 24,
      completedItems: 8,
      lastUpdated: "2 hours ago",
      createdBy: "Sarah Johnson",
      comments: 3,
      contributors: [
        {
          avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
          avatarAlt: "Professional woman with shoulder-length brown hair smiling at camera in white blazer",
          isOnline: true
        },
        {
          avatar: "https://images.unsplash.com/photo-1597113113991-74221fab863e",
          avatarAlt: "Middle-aged man with short brown hair and beard in casual blue shirt outdoors",
          isOnline: false
        }],

      recentActivity: "Mike added 3 items to produce section"
    },
    {
      id: 2,
      name: "Birthday Party Supplies",
      description: "Everything needed for Emma\'s 16th birthday celebration this weekend",
      status: "active",
      totalItems: 18,
      completedItems: 12,
      lastUpdated: "30 minutes ago",
      createdBy: "Emma Johnson",
      comments: 7,
      contributors: [
        {
          avatar: "https://images.unsplash.com/photo-1732549681200-fe515b7d22dc",
          avatarAlt: "Young woman with long blonde hair smiling brightly in casual pink top",
          isOnline: true
        },
        {
          avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
          avatarAlt: "Professional woman with shoulder-length brown hair smiling at camera in white blazer",
          isOnline: true
        }],

      recentActivity: "Sarah completed decorations section"
    },
    {
      id: 3,
      name: "Holiday Meal Prep",
      description: "Thanksgiving dinner ingredients and preparation items for the family gathering",
      status: "completed",
      totalItems: 32,
      completedItems: 32,
      lastUpdated: "3 days ago",
      createdBy: "Mike Johnson",
      comments: 12,
      contributors: [
        {
          avatar: "https://images.unsplash.com/photo-1597113113991-74221fab863e",
          avatarAlt: "Middle-aged man with short brown hair and beard in casual blue shirt outdoors",
          isOnline: false
        },
        {
          avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
          avatarAlt: "Professional woman with shoulder-length brown hair smiling at camera in white blazer",
          isOnline: true
        },
        {
          avatar: "https://images.unsplash.com/photo-1732549681200-fe515b7d22dc",
          avatarAlt: "Young woman with long blonde hair smiling brightly in casual pink top",
          isOnline: true
        }],

      recentActivity: "All items completed successfully"
    }];


  // Mock data for activity feed
  const recentActivities = [
    {
      id: 1,
      type: "item_added",
      user: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1597113113991-74221fab863e",
        avatarAlt: "Middle-aged man with short brown hair and beard in casual blue shirt outdoors"
      },
      action: "added 3 items to",
      target: "Weekly Groceries",
      details: "Bananas, Greek yogurt, and whole wheat bread",
      listName: "Weekly Groceries",
      timestamp: new Date("2024-01-15T10:30:00Z")
    },
    {
      id: 2,
      type: "item_completed",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
        avatarAlt: "Professional woman with shoulder-length brown hair smiling at camera in white blazer"
      },
      action: "completed decorations section in",
      target: "Birthday Party Supplies",
      details: "All party decorations have been purchased",
      listName: "Birthday Party Supplies",
      timestamp: new Date("2024-01-15T09:30:00Z")
    },
    {
      id: 3,
      type: "comment_added",
      user: {
        name: "Emma Johnson",
        avatar: "https://images.unsplash.com/photo-1732549681200-fe515b7d22dc",
        avatarAlt: "Young woman with long blonde hair smiling brightly in casual pink top"
      },
      action: "commented on",
      target: "Birthday Party Supplies",
      details: "Don\'t forget to get the special candles!",
      listName: "Birthday Party Supplies",
      timestamp: new Date("2024-01-15T08:00:00Z")
    },
    {
      id: 4,
      type: "list_created",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
        avatarAlt: "Professional woman with shoulder-length brown hair smiling at camera in white blazer"
      },
      action: "created a new list",
      target: "Weekend BBQ Supplies",
      details: "Planning for the neighborhood barbecue",
      timestamp: new Date("2024-01-15T06:00:00Z")
    },
    {
      id: 5,
      type: "list_shared",
      user: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1597113113991-74221fab863e",
        avatarAlt: "Middle-aged man with short brown hair and beard in casual blue shirt outdoors"
      },
      action: "shared",
      target: "Hardware Store Run",
      details: "Added to family shared lists",
      timestamp: new Date("2024-01-15T03:00:00Z")
    }];


  // Mock family stats
  const familyStats = {
    totalLists: 15,
    activeMembers: 3,
    itemsThisWeek: 47,
    completedTasks: 156
  };

  const currentUserId = 1; // Sarah Johnson is the current user

  const handleInviteMember = async (inviteData: InviteData) => {
    console.log('Inviting member:', inviteData);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleEditRole = (member: FamilyMember) => {
    console.log('Editing role for:', member);
  };

  const handleRemoveMember = (member: FamilyMember) => {
    console.log('Removing member:', member);
  };

  const handleViewList = (list: SharedList) => {
    console.log('Viewing list:', list);
  };

  const handleEditList = (list: SharedList) => {
    console.log('Editing list:', list);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Home' },
    { id: 'members', label: 'Members', icon: 'Users' },
    { id: 'lists', label: 'Shared Lists', icon: 'List' },
    { id: 'activity', label: 'Activity', icon: 'Activity' }];


  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Family Hub</h1>
            <p className="text-text-secondary">
              Coordinate shopping lists and manage family members in one place
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <CustomeButton
              variant="outline"
              iconName="Settings"
              iconPosition="left">

              Family Settings
            </CustomeButton>
            <CustomeButton
              iconName="UserPlus"
              iconPosition="left"
              onClick={() => setShowInviteModal(true)}>

              Invite Member
            </CustomeButton>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 mb-8 bg-muted/50 p-1 rounded-lg w-fit">
          {tabs?.map((tab) =>
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium calm-transition ${activeTab === tab?.id ?
                'bg-card text-text-primary shadow-soft' :
                'text-text-secondary hover:text-text-primary hover:bg-muted/50'}`
              }>

              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' &&
          <div className="space-y-8">
            {/* Stats and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FamilyStatsCard stats={familyStats} />
              <QuickActions
                onCreateList={() => console.log('Create list')}
                onInviteMember={() => setShowInviteModal(true)}
                onStartShopping={() => console.log('Start shopping')}
                onViewHistory={() => console.log('View history')} />

            </div>

            {/* Recent Activity and Active Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ActivityFeed activities={recentActivities} />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">Active Lists</h2>
                  <Link
                    href="/active-shopping-list"
                    className="text-sm text-brand-primary hover:text-brand-primary/80 calm-transition">

                    View All Lists
                  </Link>
                </div>
                {sharedLists?.filter((list) => list?.status === 'active')?.map((list) =>
                  <SharedListCard
                    key={list?.id}
                    list={list}
                    onViewList={handleViewList}
                    onEditList={handleEditList} />

                )}
              </div>
            </div>
          </div>
        }

        {activeTab === 'members' &&
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Family Members</h2>
                <p className="text-text-secondary">Manage roles and permissions for your family</p>
              </div>
              <CustomeButton
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => setShowInviteModal(true)}>

                Invite Member
              </CustomeButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers?.map((member) =>
                <FamilyMemberCard
                  key={member?.id}
                  member={member}
                  isCurrentUser={member?.id === currentUserId}
                  onEditRole={handleEditRole}
                  onRemove={handleRemoveMember} />

              )}
            </div>
          </div>
        }

        {activeTab === 'lists' &&
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Shared Lists</h2>
                <p className="text-text-secondary">All family shopping lists in one place</p>
              </div>
              <Link href="/active-shopping-list">
                <CustomeButton iconName="Plus" iconPosition="left">
                  Create New List
                </CustomeButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sharedLists?.map((list) =>
                <SharedListCard
                  key={list?.id}
                  list={list}
                  onViewList={handleViewList}
                  onEditList={handleEditList} />

              )}
            </div>
          </div>
        }

        {activeTab === 'activity' &&
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">Family Activity</h2>
              <p className="text-text-secondary">
                Track all family member contributions and shopping progress
              </p>
            </div>
            <ActivityFeed activities={recentActivities} />
          </div>
        }

        {/* Invite Member Modal */}
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteMember} />

      </div>
    </div>);

};

export default FamilyHub;