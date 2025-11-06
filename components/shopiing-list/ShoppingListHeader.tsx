import { CustomeButton } from '@/components/ui/CustomeButton';
import React from 'react';

interface ShoppingListHeaderProps {
    listName: string;
    totalItems: number;
    completedItems: number;
    onAddItem: () => void;
    onVoiceInput: () => void;
    onShareList: () => void;
    onListSettings: () => void;
}

const ShoppingListHeader: React.FC<ShoppingListHeaderProps> = ({
    listName,
    totalItems,
    completedItems,
    onAddItem,
    onVoiceInput,
    onShareList,
    onListSettings
}) => {
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;


    return (
        <div className="bg-surface border-b border-border p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-text-primary mb-2">{listName}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{completedItems} of {totalItems} items completed</span>
                            <span className="text-blue-500 font-bold">{completionPercentage}% done</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName="Mic"
                            onClick={onVoiceInput}
                            className="text-text-secondary hover:text-brand-primary"
                        />
                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName="Share2"
                            onClick={onShareList}
                            className="text-text-secondary hover:text-brand-primary"
                        />
                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName="Settings"
                            onClick={onListSettings}
                            className="text-text-secondary hover:text-brand-primary"
                        />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="w-full bg-muted rounded-full h-2">
                        <div
                            className="bg-linear-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-3">
                    <CustomeButton
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={onAddItem}
                        className="flex-1 sm:flex-none"
                    >
                        Add Item
                    </CustomeButton>

                    <CustomeButton
                        variant="outline"
                        iconName="Scan"
                        iconPosition="left"
                        className="hidden sm:flex"
                    >
                        Scan Barcode
                    </CustomeButton>

                    <CustomeButton
                        variant="outline"
                        iconName="Clock"
                        iconPosition="left"
                        className="hidden md:flex"
                    >
                        Quick Add
                    </CustomeButton>
                </div>
            </div>
        </div>
    );
};

export default ShoppingListHeader;