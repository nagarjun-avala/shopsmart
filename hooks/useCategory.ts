import { useState, useEffect } from 'react';
import { CategoryType, NewCategory } from '@/types/all';

type CategoriesSummaryType = {
    totalCategories: number;
    totalItems: number;
    mostUsedCategory: string;
    avgPerCategory: number;
}

export const useCategory = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [categoriesSummary, setCategoriesSummary] = useState<CategoriesSummaryType>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/category');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.categories || []);
            setCategoriesSummary(data.summary || {})
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    // Create new category
    const createCategory = async (categoryData: NewCategory) => {
        try {
            const response = await fetch('/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create category');
            }
            const newCategory = await response.json();
            setCategories(prev => [...prev, newCategory]);
            return newCategory;
        } catch (err) {
            console.error('Error creating category:', err);
            throw err;
        }
    };

    // Update existing category
    const updateCategory = async (categoryId: string, categoryData: Partial<CategoryType>) => {
        try {
            const response = await fetch(`/api/category/${categoryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update category');
            }
            const updatedCategory = await response.json();
            setCategories(prev => prev.map(cat => cat.id === categoryId ? updatedCategory : cat));
            return updatedCategory;
        } catch (err) {
            console.error('Error updating category:', err);
            throw err;
        }
    };

    // Delete category
    const deleteCategory = async (categoryId: string) => {
        try {
            const response = await fetch(`/api/category/${categoryId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete category');
            }
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        } catch (err) {
            console.error('Error deleting category:', err);
            throw err;
        }
    };

    // Bulk delete categories
    const deleteCategories = async (categoryIds: string[]) => {
        try {
            const deletePromises = categoryIds.map(id =>
                fetch(`/api/category/${id}`, { method: 'DELETE' })
            );
            const responses = await Promise.all(deletePromises);
            const failedResponses = responses.filter(res => !res.ok);
            if (failedResponses.length > 0) {
                throw new Error('Failed to delete some categories');
            }
            setCategories(prev => prev.filter(cat => !categoryIds.includes(cat.id)));
        } catch (err) {
            console.error('Error deleting categories:', err);
            throw err;
        }
    };

    // Initialize on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        categoriesSummary,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        deleteCategories,
        refetchCategories: fetchCategories,
    };
};
