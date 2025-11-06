import React from 'react';
import Icon from '@/components/AppIcon';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}


const SettingsSection = ({ title, description, icon, children, className = "" }: SettingsSectionProps) => {
  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-text-primary mb-1">{title}</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;