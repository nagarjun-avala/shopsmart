import React, { useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import CustomeSelect from '@/components/ui/customeSelect';

type NotificationStateType = {
  listUpdates: boolean;
  familyActivity: boolean;
  shoppingReminders: boolean;
  suggestions: boolean;
  weeklyReports: boolean;
  priceAlerts: boolean;
  stockAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState<NotificationStateType>({
    listUpdates: true,
    familyActivity: true,
    shoppingReminders: false,
    suggestions: true,
    weeklyReports: true,
    priceAlerts: false,
    stockAlerts: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: "22:00",
    endTime: "08:00"
  });

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i?.toString()?.padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const toggleNotification = (key: keyof NotificationStateType) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SettingsSection
      title="Notifications"
      description="Control when and how you receive notifications"
      icon="Bell"
    >
      {/* Notification Types */}
      <div className="space-y-3">
        <h3 className="font-medium text-text-primary mb-3">Notification Types</h3>

        <SettingItem
          label="List Updates"
          description="When items are added or removed from shared lists"
          value={notifications?.listUpdates}
          icon="List"
          onClick={() => toggleNotification('listUpdates')}
          action={
            <ToggleSwitch
              enabled={notifications?.listUpdates}
              onChange={() => toggleNotification('listUpdates')}
            />
          }
        />

        <SettingItem
          label="Family Activity"
          description="When family members complete shopping or update lists"
          value={notifications?.familyActivity}
          icon="Users"
          onClick={() => toggleNotification('familyActivity')}
          action={
            <ToggleSwitch
              enabled={notifications?.familyActivity}
              onChange={() => toggleNotification('familyActivity')}
            />
          }
        />

        <SettingItem
          label="Shopping Reminders"
          description="Reminders to go shopping based on your schedule"
          value={notifications?.shoppingReminders}
          icon="Clock"
          onClick={() => toggleNotification('shoppingReminders')}
          action={
            <ToggleSwitch
              enabled={notifications?.shoppingReminders}
              onChange={() => toggleNotification('shoppingReminders')}
            />
          }
        />

        <SettingItem
          label="Smart Suggestions"
          description="AI-powered recommendations for items to add"
          value={notifications?.suggestions}
          icon="Lightbulb"
          onClick={() => toggleNotification('suggestions')}
          action={
            <ToggleSwitch
              enabled={notifications?.suggestions}
              onChange={() => toggleNotification('suggestions')}
            />
          }
        />

        <SettingItem
          label="Weekly Reports"
          description="Summary of your shopping patterns and savings"
          value={notifications?.weeklyReports}
          icon="BarChart"
          onClick={() => toggleNotification('weeklyReports')}
          action={
            <ToggleSwitch
              enabled={notifications?.weeklyReports}
              onChange={() => toggleNotification('weeklyReports')}
            />
          }
        />

        <SettingItem
          label="Price Alerts"
          description="When items on your list go on sale"
          value={notifications?.priceAlerts}
          icon="DollarSign"
          onClick={() => toggleNotification('priceAlerts')}
          action={
            <ToggleSwitch
              enabled={notifications?.priceAlerts}
              onChange={() => toggleNotification('priceAlerts')}
            />
          }
        />

        <SettingItem
          label="Stock Alerts"
          description="When frequently bought items are running low"
          value={notifications?.stockAlerts}
          icon="Package"
          onClick={() => toggleNotification('stockAlerts')}
          action={
            <ToggleSwitch
              enabled={notifications?.stockAlerts}
              onChange={() => toggleNotification('stockAlerts')}
            />
          }
        />
      </div>
      {/* Delivery Methods */}
      <div className="border-t border-border pt-6">
        <h3 className="font-medium text-text-primary mb-3">Delivery Methods</h3>

        <SettingItem
          label="Email Notifications"
          description="Receive notifications via email"
          value={notifications?.emailNotifications}
          icon="Mail"
          onClick={() => toggleNotification('emailNotifications')}
          action={
            <ToggleSwitch
              enabled={notifications?.emailNotifications}
              onChange={() => toggleNotification('emailNotifications')}
            />
          }
        />

        <SettingItem
          label="Push Notifications"
          description="Browser and mobile push notifications"
          value={notifications?.pushNotifications}
          icon="Bell"
          onClick={() => toggleNotification('pushNotifications')}
          action={
            <ToggleSwitch
              enabled={notifications?.pushNotifications}
              onChange={() => toggleNotification('pushNotifications')}
            />
          }
        />

        <SettingItem
          label="SMS Notifications"
          description="Text message notifications for urgent updates"
          value={notifications?.smsNotifications}
          icon="MessageSquare"
          onClick={() => toggleNotification('smsNotifications')}
          action={
            <ToggleSwitch
              enabled={notifications?.smsNotifications}
              onChange={() => toggleNotification('smsNotifications')}
            />
          }
        />
      </div>
      {/* Quiet Hours */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-text-primary">Quiet Hours</h3>
            <p className="text-sm text-text-secondary">Pause non-urgent notifications during these hours</p>
          </div>
          <ToggleSwitch
            enabled={quietHours?.enabled}
            onChange={(enabled: boolean) => setQuietHours(prev => ({ ...prev, enabled }))}
          />
        </div>

        {quietHours?.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <CustomeSelect
              label="Start Time"
              options={timeOptions}
              value={quietHours?.startTime}
              onChange={(value) => setQuietHours(prev => ({ ...prev, startTime: value as string }))}
            />
            <CustomeSelect
              label="End Time"
              options={timeOptions}
              value={quietHours?.endTime}
              onChange={(value) => setQuietHours(prev => ({ ...prev, endTime: value as string }))}
            />
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default NotificationSettings;