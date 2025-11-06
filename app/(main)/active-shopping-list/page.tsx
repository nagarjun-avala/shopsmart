"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLists } from '@/hooks/useLists';
import Icon from '@/components/AppIcon';

const ActiveShoppingListRedirect = () => {
    const router = useRouter();
    const { lists, loading } = useLists();

    useEffect(() => {
        if (!loading && lists.length > 0) {
            const firstList = lists[0];
            router.replace(`/active-shopping-list/${firstList.id}`);
        }
    }, [lists, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Icon name="Loader" size={48} className="text-text-secondary mx-auto mb-4 animate-spin" />
                    <p className="text-text-secondary">Redirecting to your first list...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No lists found</h3>
                <p className="text-text-secondary">Please create a shopping list to get started.</p>
            </div>
        </div>
    );
};

export default ActiveShoppingListRedirect;
