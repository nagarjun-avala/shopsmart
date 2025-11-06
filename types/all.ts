export type ShoppingItemType = {
    id?: string;
    name: string;
    quantity: number;
    unit: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    note?: string;
    categoryId: string;
    category?: CategoryType | null;
    brand: string | undefined;
    estimatedPrice: number | undefined;
    addedBy: string;
    listId: string;
    completedAt?: string | Date | null;
    createdAt: string | Date;
    updatedAt: string | Date;

};

export type NewShoppingItem = Omit<ShoppingItemType, 'id' | 'completedAt' | 'createdAt' | 'updatedAt' | 'addedBy'> & { id?: string };

export type CategoryType = {
    id: string; // unique id, matches DB key
    name: string;
    slug: string; // SEO + clean urls => "dairy-eggs"
    color: string; // Tailwind or hex
    icon: string; // Lucide icon name or component
    description?: string;
    type: 'system' | 'custom'; // system = default categories
    itemCount: number; // number of items in this category
    frequency: string; // how often items from this category are bought
    lastUsed: string;
    recentItems: string[]; // last 5 items added in this category
    isActive: boolean;
    usagePercentage: number; // percentage of items in this category
    createdBy?: string | null; // null for system categories
    meta?: Record<string, unknown>; // bonus extensibility
    createdAt: string | Date;
    updatedAt: string | Date;
};

export type NewCategory = Omit<CategoryType, 'id' | 'createdAt' | 'updatedAt'>
    & { id?: string; createdAt?: string | Date; updatedAt?: string | Date };

export type UserPreferences = {
    defaultView: 'category' | 'list';
    sortBy: 'category' | 'name' | 'priority' | 'alphabetical' | 'added';
    showCompletedItems: boolean;
    theme: 'light' | 'dark' | 'system';
};
export type NewUserPreferences = Partial<UserPreferences>;

export type ShoppingList = {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'draft';
    createdAt: string;
    updatedAt: string;
    createdUserId: string;
    contributors: string[];
    items: ShoppingItemType[];
    categories: CategoryType[];
    preferences: UserPreferences;
};
export type NewShoppingList = Omit<ShoppingList, 'id' | 'items' | 'categories' | 'preferences'> & { id?: string };

export type CategoryTemplateData = {
    id: string;
    icon: string;
    name: string;
    categoryCount: number;
    description: string;
    categories: {
        color: string;
        icon: string;
        name: string;
    }[];
    isPopular: boolean;
    isNew: boolean;
    usedBy: string;
    rating: string;
    difficulty: string;
};

// Additional types can be added here as needed
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export interface InviteData {
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    message: string;
}

export interface Activity {
    id: number;
    user: {
        avatar: string;
        avatarAlt: string;
        name: string;
    };
    type: string;
    action: string;
    target?: string;
    timestamp: Date;
    details?: string;
    listName?: string;
}

export interface Contributor {
    avatar: string;
    avatarAlt: string;
    isOnline: boolean;
}

export interface SharedListType {
    id: number;
    name: string;
    status: 'active' | 'completed' | 'draft';
    description: string;
    totalItems: number;
    completedItems: number;
    lastUpdated: string;
    contributors: Contributor[];
    createdBy: string;
    comments: number;
    recentActivity?: string;
}

export interface SharedListCardProps {
    list: SharedListType;
    onViewList: (list: SharedListType) => void;
    onEditList: (list: SharedListType) => void;
}
