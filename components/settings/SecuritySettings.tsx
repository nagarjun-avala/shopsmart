import React, { useState } from 'react';
import { CustomeButton } from '@/components/ui/CustomeButton';
import CustomeInput from '@/components/ui/CustomeInput';
import Icon from '@/components/AppIcon';
import SettingsSection from './SettingsSection';
import SettingItem from './SettingItem';
import { Button } from '../ui/button';
import ToggleSwitch from './ToggleSwitch';
import ManageDevices from '../ManageDevices';

const SecuritySettings = () => {
  const [security, setSecurityState] = useState({
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: '180',
    loginAlerts: false,
    deviceManagement: true
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const connectedDevices = [
    {
      id: 1,
      name: "iPhone 14 Pro",
      type: "Mobile",
      lastActive: "Active now",
      location: "New York, NY",
      icon: "Smartphone"
    },
    {
      id: 2,
      name: "MacBook Pro",
      type: "Desktop",
      lastActive: "2 hours ago",
      location: "New York, NY",
      icon: "Laptop"
    },
    {
      id: 3,
      name: "iPad Air",
      type: "Tablet",
      lastActive: "1 day ago",
      location: "New York, NY",
      icon: "Tablet"
    }
  ];

  const toggleSecurity = (key: 'twoFactorAuth' | 'biometricAuth' | 'loginAlerts' | 'deviceManagement') => {
    setSecurityState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    // Handle password change logic
  };

  const handleEnable2FA = () => {
    setShow2FAModal(false);
    toggleSecurity('twoFactorAuth');
    // Handle 2FA setup logic
  };

  return (
    <>
      <SettingsSection
        title="Security & Authentication"
        description="Protect your account with advanced security features"
        icon="Lock"
      >
        {/* Authentication */}
        <div className="space-y-3">
          <h3 className="font-medium text-text-primary mb-3">Authentication</h3>

          <SettingItem
            label="Change Password"
            description="Update your account password"
            icon="Key"
            action={
              <CustomeButton variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                Change
              </CustomeButton>
            }
          />

          <SettingItem
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            icon="Shield"
            action={
              <div className="flex items-center space-x-2">
                {security?.twoFactorAuth && (
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                    Enabled
                  </span>
                )}
                <ToggleSwitch
                  enabled={security?.twoFactorAuth}
                  onChange={() => setShow2FAModal(true)}
                />
              </div>
            }
          />

          <SettingItem
            label="Biometric Authentication"
            description="Use fingerprint or face recognition when available"
            icon="Fingerprint"
            action={
              <ToggleSwitch
                enabled={security?.biometricAuth}
                onChange={() => toggleSecurity('biometricAuth')}
              />
            }
          />
        </div>

        {/* Session Management */}
        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-text-primary mb-3">Session Management</h3>

          <SettingItem
            label="Auto-logout"
            description="Automatically sign out after inactivity"
            value={`${security?.sessionTimeout} minutes`}
            action={
              <Button variant="outline" size="sm">
                Change
              </Button>
            }
          />

          <SettingItem
            label="Login Alerts"
            description="Get notified of new sign-ins to your account"
            icon="Bell"
            action={
              <ToggleSwitch
                enabled={security?.loginAlerts}
                onChange={() => toggleSecurity('loginAlerts')}
              />
            }
          />
        </div>

        {/* Connected Devices */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-text-primary">Connected Devices</h3>
              <p className="text-sm text-text-secondary">Manage devices that have access to your account</p>
            </div>
            <Button variant="outline" size="sm">
              Sign Out All
            </Button>
          </div>

          <div className="space-y-3">
            <ManageDevices />
            {connectedDevices?.map((device) => (
              <div key={device?.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={device?.icon} size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{device?.name}</div>
                    <div className="text-sm text-text-secondary">
                      {device?.lastActive} • {device?.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {device?.lastActive === "Active now" && (
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  )}
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-text-primary mb-3">Security Recommendations</h3>

          <div className="bg-blue-50 dark:bg-primary-foreground border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={16} className="text-blue-600 dark:text-blue-500 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 dark:text-blue-400 font-medium mb-2">Your account security score: 85/100</p>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>✓ Strong password enabled</li>
                  <li>✓ Recent login activity monitored</li>
                  <li>⚠ Consider enabling two-factor authentication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Key" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Change Password</h3>
            </div>

            <div className="space-y-4">
              <CustomeInput
                label="Current Password"
                type="password"
                value={passwordData?.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e?.target?.value }))}
                required
              />
              <CustomeInput
                label="New Password"
                type="password"
                value={passwordData?.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e?.target?.value }))}
                required
              />
              <CustomeInput
                label="Confirm New Password"
                type="password"
                value={passwordData?.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e?.target?.value }))}
                required
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <Button onClick={handlePasswordChange} className="flex-1">
                Update Password
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">{security.twoFactorAuth ? "Disable " : "Enable "}
                Two-Factor Authentication</h3>
            </div>

            <p className="text-text-secondary mb-6">
              Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
            </p>

            <div className="flex space-x-3">
              <Button onClick={handleEnable2FA} className="flex-1">
                {security.twoFactorAuth ? "Disable " : "Enable "} 2FA
              </Button>
              <Button
                variant="outline"
                onClick={() => setShow2FAModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecuritySettings;