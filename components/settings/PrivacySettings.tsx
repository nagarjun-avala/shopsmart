import React, { useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import Icon from '@/components/AppIcon';
import { Button } from '../ui/button';

const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analytics: false,
    personalization: true,
    thirdPartySharing: false,
    locationTracking: true,
    cookieConsent: true
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  const handleExportData = () => {
    // Export data logic
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <SettingsSection
        title="Privacy & Data"
        description="Control how your data is collected, used, and shared"
        icon="Shield"
      >
        {/* Data Collection */}
        <div className="space-y-3">
          <h3 className="font-medium text-text-primary mb-3">Data Collection</h3>

          <SettingItem
            label="Usage Analytics"
            description="Help improve ShopSmart by sharing anonymous usage data"
            action={
              <ToggleSwitch
                enabled={privacy?.analytics}
                onChange={() => togglePrivacy('analytics')}
              />
            }
          />

          <SettingItem
            label="Personalization Data"
            description="Allow collection of shopping patterns for personalized suggestions"
            action={
              <ToggleSwitch
                enabled={privacy?.personalization}
                onChange={() => togglePrivacy('personalization')}
              />
            }
          />

          <SettingItem
            label="Location Tracking"
            description="Use location data for store recommendations and local deals"
            action={
              <ToggleSwitch
                enabled={privacy?.locationTracking}
                onChange={() => togglePrivacy('locationTracking')}
              />
            }
          />

          <SettingItem
            label="Cookie Consent"
            description="Allow cookies for enhanced functionality and preferences"
            action={
              <ToggleSwitch
                enabled={privacy?.cookieConsent}
                onChange={() => togglePrivacy('cookieConsent')}
              />
            }
          />
        </div>

        {/* Data Sharing */}
        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-text-primary mb-3">Data Sharing</h3>

          <SettingItem
            label="Third-Party Sharing"
            description="Share anonymized data with partner stores for better deals"
            action={
              <ToggleSwitch
                enabled={privacy?.thirdPartySharing}
                onChange={() => togglePrivacy('thirdPartySharing')}
              />
            }
          />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium mb-1">Data Protection Notice</p>
                <p className="text-amber-700">
                  Your personal shopping data is encrypted and never sold to third parties.
                  We only share anonymized, aggregated data to improve service quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-text-primary mb-3">Data Management</h3>

          <div className="space-y-2">
            <SettingItem
              label="Download Your Data"
              description="Export all your shopping lists, history, and preferences"
              icon="Download"
              action={
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  Export
                </Button>
              }
            />

            <SettingItem
              label="Data Retention"
              description="Shopping history is kept for 2 years, then automatically deleted"
              icon="Clock"
              value="2 years"
            />

            <SettingItem
              label="Account Deletion"
              description="Permanently delete your account and all associated data"
              icon="Trash2"
              action={
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              }
            />
          </div>
        </div>

        {/* Privacy Resources */}
        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-text-primary mb-3">Privacy Resources</h3>

          <div className="space-y-2">
            <SettingItem
              label="Privacy Policy"
              description="Read our complete privacy policy"
              icon="FileText"
              showArrow
              onClick={() => window.open('/privacy-policy', '_blank')}
            />

            <SettingItem
              label="Terms of Service"
              description="Review our terms and conditions"
              icon="Scale"
              showArrow
              onClick={() => window.open('/terms', '_blank')}
            />

            <SettingItem
              label="Contact Privacy Team"
              description="Questions about your data and privacy"
              icon="MessageCircle"
              showArrow
              onClick={() => window.open('mailto:privacy@shopsmart.com')}
            />
          </div>
        </div>
      </SettingsSection>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Delete Account</h3>
            </div>

            <p className="text-text-secondary mb-6">
              This action cannot be undone. All your shopping lists, history, and preferences will be permanently deleted.
            </p>

            <div className="flex space-x-3">
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteModal(false);
                  // Handle account deletion
                }}
                className="flex-1"
              >
                Delete Account
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
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

export default PrivacySettings;