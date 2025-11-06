import { useState, useEffect, useCallback } from 'react';
import { ShoppingList } from '@/types/all';

export const useLists = () => {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
    const [selectedListId, setSelectedListId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all lists
    const fetchLists = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/lists');
            if (!response.ok) {
                throw new Error('Failed to fetch lists');
            }
            const data = await response.json();
            setLists(data.lists || []);
        } catch (err) {
            console.error('Error fetching lists:', err);
            setError('Failed to load shopping lists');
        } finally {
            setLoading(false);
        }
    };

    // Fetch specific list details
    const fetchListDetails = async (listId: string) => {
        try {
            const response = await fetch(`/api/lists/${listId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch list details');
            }
            const data = await response.json();
            setSelectedList(data.list);
        } catch (err) {
            console.error('Error fetching list details:', err);
            setError('Failed to load list details');
        }
    };

    // Handle list selection
    const selectList = useCallback(async (listId: string) => {
        setSelectedListId(listId);
        await fetchListDetails(listId);
    }, []);

    // Create new list
    const createList = async (name: string, description?: string) => {
        try {
            setCreating(true);
            const response = await fetch('/api/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description: description || '',
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create list');
            }
            const data = await response.json();

            const newList = data;
            setLists(prev => [...prev, newList]);
            await selectList(newList.id);
            return newList;
        } catch (err) {
            console.error('Error creating list:', err);
            throw err;
        } finally {
            setCreating(false);
        }
    };

    // Initialize on mount
    useEffect(() => {
        fetchLists();
    }, []);

    // Auto-select first list when lists are loaded
    useEffect(() => {
        if (lists.length > 0 && !selectedListId) {
            const defaultList = lists[0];
            selectList(defaultList.id);
        }
    }, [lists, selectList, selectedListId]);

    return {
        lists,
        selectedList,
        selectedListId,
        loading,
        creating,
        error,
        selectList,
        createList,
        refetchLists: fetchLists,
        refetchListDetails: fetchListDetails
    };
};
