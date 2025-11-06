import React, { useState } from 'react';
import { CustomeButton } from '@/components/ui/CustomeButton';
import CustomeInput from '@/components/ui/CustomeInput';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateList: (name: string, description?: string) => Promise<void>;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ isOpen, onClose, onCreateList }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onCreateList(name.trim(), description.trim() || undefined);
            setName('');
            setDescription('');
            onClose();
        } catch (error) {
            console.error('Failed to create list:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-primary-foreground rounded-xl shadow-gentle max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">Create New List</h2>
                    <CustomeButton
                        variant="ghost"
                        size="icon"
                        iconName="X"
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary"
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <CustomeInput
                        label="List Name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        placeholder="e.g., Weekly Groceries"
                        required
                    />

                    <CustomeInput
                        label="Description (Optional)"
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                        placeholder="Brief description of the list"
                    />

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <CustomeButton
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </CustomeButton>
                        <CustomeButton
                            type="submit"
                            variant="default"
                            className="flex-1"
                            disabled={!name.trim() || loading}
                        >
                            {loading ? 'Creating...' : 'Create List'}
                        </CustomeButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListModal;
