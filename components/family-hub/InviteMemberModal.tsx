import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';
import CustomeInput from '@/components/ui/CustomeInput';
import CustomeSelect from '@/components/ui/customeSelect';
import { InviteData } from '@/types/all';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteData) => Promise<void>;
}

const InviteMemberModal = ({ isOpen, onClose, onInvite }: InviteMemberModalProps) => {
  const [formData, setFormData] = useState<InviteData>({
    email: '',
    role: 'viewer',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Full access to manage family and lists' },
    { value: 'editor', label: 'Editor', description: 'Can create and edit lists' },
    { value: 'viewer', label: 'Viewer', description: 'Can view and check off items' }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      await onInvite(formData);
      setFormData({ email: '', role: 'viewer', message: '' });
      onClose();
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof InviteData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: String(value) }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-gentle max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="UserPlus" size={20} className="text-brand-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Invite Family Member</h2>
          </div>
          <CustomeButton
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <CustomeInput
            label="Email Address"
            type="email"
            placeholder="Enter family member's email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            required
            description="We'll send them an invitation to join your family hub"
          />

          <CustomeSelect
            label="Role"
            description="Choose what permissions they'll have"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value as InviteData['role'])}
          />

          <CustomeInput
            label="Personal Message (Optional)"
            type="textarea"
            placeholder="Add a personal note to your invitation..."
            value={formData?.message}
            onChange={(e) => handleInputChange('message', e?.target?.value)}
            description="This message will be included in the invitation email"
            className="min-h-20"
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-brand-primary mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-text-primary mb-1">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>• They&apos;ll receive an email invitation</li>
                  <li>• They can accept and create their account</li>
                  <li>• They&apos;ll have access based on the role you selected</li>
                  <li>• You can change their role anytime later</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <CustomeButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </CustomeButton>
            <CustomeButton
              type="submit"
              loading={isLoading}
              iconName="Send"
              iconPosition="left"
            >
              Send Invitation
            </CustomeButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;