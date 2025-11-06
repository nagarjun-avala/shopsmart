import React, { useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingItem from './SettingItem';
import CustomeInput from '@/components/ui/CustomeInput';
import CustomeSelect from '@/components/ui/customeSelect';
import Image from '@/components/AppImage';
import { Button } from '../ui/button';
import Icon from '../AppIcon';

type ProfileDataType = {
  name: string;
  email: string;
  phone: string;
  householdSize: string;
  dietaryPreferences: string;
  shoppingFrequency: string;
};

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileDataType>({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    householdSize: "4",
    dietaryPreferences: "vegetarian",
    shoppingFrequency: "weekly"
  });

  const householdSizeOptions = [
    { value: "1", label: "1 person" },
    { value: "2", label: "2 people" },
    { value: "3", label: "3 people" },
    { value: "4", label: "4 people" },
    { value: "5", label: "5+ people" }
  ];


  const dietaryOptions = [
    { value: "none", label: "No restrictions" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten-free" },
    { value: "keto", label: "Keto" },
    { value: "paleo", label: "Paleo" }
  ];


  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" }
  ];


  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  return (
    <SettingsSection
      title="Profile & Preferences"
      description="Manage your personal information and shopping preferences"
      icon="User">

      {/* Profile Picture */}
      <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1730222168387-051038de25be"
            alt="Professional headshot of woman with brown hair smiling at camera"
            className="w-16 h-16 rounded-full object-cover" />

          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm hover:scale-120">
            <span className="text-white dark:text-gray-500 text-xs">
              <Icon name='Pencil' size={12} />
            </span>
          </button>
        </div>
        <div>
          <h3 className="font-medium text-text-primary">Profile Picture</h3>
          <p className="text-sm text-text-secondary">JPG, PNG up to 5MB</p>
        </div>
      </div>
      {/* Profile Information */}
      {isEditing ?
        <div className="space-y-4">
          <CustomeInput
            label="Full Name"
            value={profileData?.name}
            onChange={(e) => setProfileData({ ...profileData, name: e?.target?.value })} />

          <CustomeInput
            label="Email Address"
            type="email"
            value={profileData?.email}
            onChange={(e) => setProfileData({ ...profileData, email: e?.target?.value })} />

          <CustomeInput
            label="Phone Number"
            type="tel"
            value={profileData?.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e?.target?.value })} />

          <CustomeSelect
            label="Household Size"
            options={householdSizeOptions}
            value={profileData?.householdSize}
            onChange={(value) => setProfileData({ ...profileData, householdSize: String(value) })} />

          <CustomeSelect
            label="Dietary Preferences"
            options={dietaryOptions}
            value={profileData?.dietaryPreferences}
            onChange={(value) => setProfileData({ ...profileData, dietaryPreferences: String(value) })} />

          <CustomeSelect
            label="Shopping Frequency"
            options={frequencyOptions}
            value={profileData?.shoppingFrequency}
            onChange={(value) => setProfileData({ ...profileData, shoppingFrequency: String(value) })} />


          <div className="flex space-x-3 pt-2">
            <Button variant="default" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div> :

        <div className="space-y-2">
          <SettingItem
            label="Full Name"
            value={profileData?.name}
            icon="User"
            description=""
            action=""
            onClick={() => { }} />

          <SettingItem
            label="Email Address"
            value={profileData?.email}
            icon="Mail"
            description=""
            action=""
            onClick={() => { }} />

          <SettingItem
            label="Phone Number"
            value={profileData?.phone}
            icon="Phone"
            description=""
            action=""
            onClick={() => { }} />

          <SettingItem
            label="Household Size"
            value={`${profileData?.householdSize} people`}
            icon="Users"
            description=""
            action=""
            onClick={() => { }} />

          <SettingItem
            label="Dietary Preferences"
            value={dietaryOptions?.find((opt) => opt?.value === profileData?.dietaryPreferences)?.label}
            icon="Utensils"
            description=""
            action=""
            onClick={() => { }} />

          <SettingItem
            label="Shopping Frequency"
            value={frequencyOptions?.find((opt) => opt?.value === profileData?.shoppingFrequency)?.label}
            icon="Calendar"
            description=""
            action=""
            onClick={() => { }} />


          <div className="pt-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      }
    </SettingsSection>);

};

export default ProfileSection;