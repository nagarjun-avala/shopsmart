import { NewShoppingItem, ShoppingItemType } from '@/types/all';
import { useState, useEffect } from 'react';

type ItemsSummaryType = {
    totalItems: number;
    completedItems: number;
    pendingItems: number;
    totalEstimatedPrice: number;
}

export const useItem = () => {
    const [categories, setCategories] = useState<ShoppingItemType[]>([]);
    const [categoriesSummary, setCategoriesSummary] = useState<ItemsSummaryType>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all items
    const fetchItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/item');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setCategories(data.items || []);
            setCategoriesSummary(data.summary || {})
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    // Create new item
    const createItem = async (itemData: NewShoppingItem) => {
        try {
            const response = await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create item');
            }
            const newItem = await response.json();
            setCategories(prev => [...prev, newItem]);
            return newItem;
        } catch (err) {
            console.error('Error creating item:', err);
            throw err;
        }
    };

    // Update existing item
    const updateItem = async (itemId: string, itemData: Partial<ShoppingItemType>) => {
        try {
            const response = await fetch(`/api/item/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update item');
            }
            const updatedItem = await response.json();
            setCategories(prev => prev.map(cat => cat.id === itemId ? updatedItem : cat));
            return updatedItem;
        } catch (err) {
            console.error('Error updating item:', err);
            throw err;
        }
    };

    // Delete item
    const deleteItem = async (itemId: string) => {
        try {
            const response = await fetch(`/api/item/${itemId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }
            setCategories(prev => prev.filter(cat => cat.id ? cat.id !== itemId : true));
        } catch (err) {
            console.error('Error deleting item:', err);
            throw err;
        }
    };

    // Bulk delete items
    const deleteItems = async (itemIds: string[]) => {
        try {
            const deletePromises = itemIds.map(id =>
                fetch(`/api/item/${id}`, { method: 'DELETE' })
            );
            const responses = await Promise.all(deletePromises);
            const failedResponses = responses.filter(res => !res.ok);
            if (failedResponses.length > 0) {
                throw new Error('Failed to delete some items');
            }
            setCategories(prev => prev.filter(cat => cat.id ? !itemIds.includes(cat.id) : true));
        } catch (err) {
            console.error('Error deleting items:', err);
            throw err;
        }
    };

    // Initialize on mount
    useEffect(() => {
        fetchItems();
    }, []);

    return {
        categories,
        categoriesSummary,
        loading,
        error,
        createItem,
        updateItem,
        deleteItem,
        deleteItems,
        refetchCategories: fetchItems,
    };
};
