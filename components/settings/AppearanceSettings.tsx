import React, { useEffect, useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import CustomeSelect from '@/components/ui/customeSelect';
import { getCurrencyOptions, formatCurrency } from '@/lib/currency';
import { useCurrency } from '@/context/currencyProvider';
import { useTheme } from 'next-themes';

const AppearanceSettings = () => {
  const { selectedCurrency, updateCurrency, isLoading } = useCurrency();
  const { setTheme, theme } = useTheme()

  const [appearance, setAppearance] = useState({
    theme: theme ?? 'system',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
    colorBlindMode: false,
    highContrast: false,
    language: 'en',
    currency: selectedCurrency,
    measurementUnit: 'imperial',
    dateFormat: 'MM/DD/YYYY'
  });

  useEffect(() => {
    setTheme(appearance.theme)
  }, [appearance.theme, setTheme])

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Auto (System)' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' }
  ];

  const measurementOptions = [
    { value: 'imperial', label: 'Imperial (lbs, oz)' },
    { value: 'metric', label: 'Metric (kg, g)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const updateAppearance = (key: keyof typeof appearance, value: string | boolean) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCurrencyChange = async (value: string | number | (string | number)[]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      const newCurrency = value.toString();
      updateAppearance('currency', newCurrency);
      await updateCurrency(newCurrency);
    }
  };

  const toggleAppearance = (key: keyof typeof appearance) => {
    setAppearance(prev => {
      const currentValue = prev[key];
      if (typeof currentValue === 'boolean') {
        return {
          ...prev,
          [key]: !currentValue
        };
      }
      return prev;
    });
  };

  return (
    <SettingsSection
      title="Appearance & Display"
      description="Customize how ShopSmart looks and feels"
      icon="Palette"
    >
      {/* Theme Settings */}
      <div className="space-y-4">
        <h3 className="font-medium text-text-primary mb-3">Theme & Layout</h3>

        <CustomeSelect
          label="Theme"
          description="Choose your preferred color scheme"
          options={themeOptions}
          value={appearance?.theme}
          onChange={(value) => updateAppearance('theme', value as string)}
        />

        <CustomeSelect
          label="Font Size"
          description="Adjust text size for better readability"
          options={fontSizeOptions}
          value={appearance?.fontSize}
          onChange={(value) => updateAppearance('fontSize', value as string)}
        />

        <SettingItem
          label="Compact Mode"
          description="Show more content by reducing spacing and padding"
          icon=""
          onClick={() => { }}
          action={
            <ToggleSwitch
              enabled={appearance?.compactMode}
              onChange={() => toggleAppearance('compactMode')}
            />
          }
        />

        <SettingItem
          label="Animations"
          description="Enable smooth transitions and micro-interactions"
          icon=""
          onClick={() => { }}
          action={
            <ToggleSwitch
              enabled={appearance?.animations}
              onChange={() => toggleAppearance('animations')}
            />
          }
        />
      </div>

      {/* Accessibility */}
      <div className="border-t border-border pt-6">
        <h3 className="font-medium text-text-primary mb-3">Accessibility</h3>

        <SettingItem
          label="High Contrast Mode"
          description="Increase contrast for better visibility"
          icon=""
          onClick={() => { }}
          action={
            <ToggleSwitch
              enabled={appearance?.highContrast}
              onChange={() => toggleAppearance('highContrast')}
            />
          }
        />

        <SettingItem
          label="Color Blind Friendly"
          description="Use patterns and shapes in addition to colors"
          icon=""
          onClick={() => { }}
          action={
            <ToggleSwitch
              enabled={appearance?.colorBlindMode}
              onChange={() => toggleAppearance('colorBlindMode')}
            />
          }
        />
      </div>

      {/* Localization */}
      <div className="border-t border-border pt-6">
        <h3 className="font-medium text-text-primary mb-3">Language & Region</h3>

        <CustomeSelect
          label="Language"
          description="Choose your preferred language"
          options={languageOptions}
          value={appearance?.language}
          onChange={(value) => updateAppearance('language', value as string)}
        />

        <CustomeSelect
          label="Currency"
          description="Default currency for price tracking and display"
          options={getCurrencyOptions()}
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          disabled={isLoading}
        />

        <CustomeSelect
          label="Measurement Units"
          description="Units for weights and quantities"
          options={measurementOptions}
          value={appearance?.measurementUnit}
          onChange={(value) => updateAppearance('measurementUnit', value as string)}
        />

        <CustomeSelect
          label="Date Format"
          description="How dates are displayed throughout the app"
          options={dateFormatOptions}
          value={appearance?.dateFormat}
          onChange={(value) => updateAppearance('dateFormat', value as string)}
        />
      </div>

      {/* Currency Preview */}
      <div className="border-t border-border pt-6">
        <h3 className="font-medium text-text-primary mb-3">Currency Preview</h3>

        <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-text-primary">Sample Shopping List</h4>
            <span className="text-sm text-text-secondary">Today, Oct 14</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-primary rounded"></div>
                <span className="text-text-primary">Organic Bananas</span>
                <span className="text-sm text-text-secondary">2 lbs</span>
              </div>
              <span className="font-medium text-text-primary">
                {formatCurrency(4.99, selectedCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className="text-text-secondary line-through">Whole Milk</span>
                <span className="text-sm text-text-secondary">1 gallon</span>
              </div>
              <span className="font-medium text-text-secondary line-through">
                {formatCurrency(3.49, selectedCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-primary rounded"></div>
                <span className="text-text-primary">Fresh Bread</span>
                <span className="text-sm text-text-secondary">1 loaf</span>
              </div>
              <span className="font-medium text-text-primary">
                {formatCurrency(2.99, selectedCurrency)}
              </span>
            </div>
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">Total:</span>
                <span className="font-semibold text-primary text-lg">
                  {formatCurrency(7.98, selectedCurrency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AppearanceSettings;