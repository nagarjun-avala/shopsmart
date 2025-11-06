"use client";
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';
import { Button } from '@/components/ui/button';
import ProfileSection from '@/components/settings/ProfileSection';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const settingsSections = [
    {
      id: 'profile',
      label: 'Profile & Preferences',
      icon: 'User',
      description: 'Personal information and shopping preferences'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Control alerts and reminders'
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: 'Palette',
      description: 'Theme, language, and display options'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Lock',
      description: 'Password, 2FA, and account protection'
    },
    {
      id: 'privacy',
      label: 'Privacy & Data',
      icon: 'Shield',
      description: 'Data collection and sharing preferences'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'Link',
      description: 'Connected apps and services'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'notifications':
        return <NotificationSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return <ProfileSection />;
    }
  };

  const activeSectionData = settingsSections?.find(section => section?.id === activeSection);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Settings Navigation */}
      <div className="hidden lg:block w-80 bg-surface border-r border-border overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
              <p className="text-sm text-gray-400">Customize your ShopSmart experience</p>
            </div>
          </div>

          <nav className="space-y-2">
            {settingsSections?.map((section) => (
              <button
                key={section?.id}
                onClick={() => setActiveSection(section?.id)}
                className={`
                      w-full flex items-start space-x-3 p-4 rounded-lg text-left calm-transition
                      ${activeSection === section?.id
                    ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-text-primary hover:bg-muted/50'
                  }
                    `}
              >
                <Icon
                  name={section?.icon}
                  size={20}
                  className={`mt-0.5 shrink-0 ${activeSection === section?.id ? 'text-primary' : 'text-current'
                    }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{section?.label}</div>
                  <div className="text-sm opacity-70 mt-0.5">{section?.description}</div>
                </div>
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <CustomeButton
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                className="w-full justify-start text-gray-400 hover:text-text-primary"
              >
                Export Data
              </CustomeButton>
              <CustomeButton
                variant="ghost"
                size="sm"
                iconName="HelpCircle"
                iconPosition="left"
                className="w-full justify-start text-gray-400 hover:text-text-primary"
              >
                Help & Support
              </CustomeButton>
              <CustomeButton
                variant="ghost"
                size="sm"
                iconName="MessageCircle"
                iconPosition="left"
                className="w-full justify-start text-gray-400 hover:text-text-primary"
              >
                Send Feedback
              </CustomeButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Settings Navigation */}
      <div className="lg:hidden w-full bg-surface border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
          <Icon name="Settings" size={20} className="text-gray-400" />
        </div>

        <div className="flex overflow-x-auto space-x-2 pb-2">
          {settingsSections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveSection(section?.id)}
              className={`
                    shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium calm-transition
                    ${activeSection === section?.id
                  ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-text-primary hover:bg-muted/50'
                }
                  `}
            >
              <Icon name={section?.icon} size={16} />
              <span>{section?.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name={activeSectionData?.icon ?? ""} size={24} className="text-primary" />
              <h2 className="text-2xl font-semibold text-text-primary">
                {activeSectionData?.label}
              </h2>
            </div>
            <p className="text-gray-400">
              {activeSectionData?.description}
            </p>
          </div>

          {/* Active Section Content */}
          {renderActiveSection()}

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-400">
                Last updated: {new Date()?.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  Reset to Defaults
                </Button>
                <Button variant="default" size="sm">
                  Save All Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;