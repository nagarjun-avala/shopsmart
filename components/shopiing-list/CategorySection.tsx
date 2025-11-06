import React from 'react';
import Icon from '@/components/AppIcon';
import ShoppingItem from './ShoppingItem';
import { CategoryType, ShoppingItemType } from '@/types/all';

interface CategorySectionProps {
    category: CategoryType;
    items: ShoppingItemType[];
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onItemToggle: (itemId?: string) => void;
    onItemEdit: (item: ShoppingItemType) => void;
    onItemDelete: (itemId: string) => void;
    onItemNote: (item: ShoppingItemType) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
    category,
    items,
    isCollapsed,
    onToggleCollapse,
    onItemToggle,
    onItemEdit,
    onItemDelete,
    onItemNote
}) => {
    const completedItems = items.filter(item => item.completed).length;
    const totalItems = items.length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
        <div className="bg-surface rounded-lg border border-border mb-4 overflow-hidden">
            {/* Category Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 calm-transition"
                onClick={onToggleCollapse}
            >
                <div className="flex items-center space-x-3">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                    >
                        <Icon
                            name={category.icon}
                            size={18}
                            color={category.color}
                        />
                    </div>

                    <div>
                        <h3 className="font-medium text-blue-600">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                            {completedItems}/{totalItems} items • {completionPercentage}% complete
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-1.5">
                        <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                                width: `${completionPercentage}%`,
                                backgroundColor: category.color
                            }}
                        />
                    </div>

                    <Icon
                        name={isCollapsed ? "ChevronDown" : "ChevronUp"}
                        size={20}
                        className="text-gray-500"
                    />
                </div>
            </div>
            {/* Items List */}
            {!isCollapsed && (
                <div className="border-t border-border">
                    {items.length === 0 ? (
                        <div className="p-8 text-center">
                            <Icon name="Package" size={32} className="text-text-secondary mx-auto mb-2" />
                            <p className="text-text-secondary">No items in this category</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {items?.map((item) => (
                                <ShoppingItem
                                    key={item.id}
                                    item={item}
                                    categoryColor={category.color}
                                    onToggle={() => onItemToggle(item?.id)}
                                    onEdit={() => onItemEdit(item)}
                                    onDelete={() => item.id && onItemDelete(item.id)}
                                    onNote={() => onItemNote(item)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategorySection;