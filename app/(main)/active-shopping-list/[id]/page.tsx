"use client"
import { CustomeButton } from '@/components/ui/CustomeButton';
import React, { useState, useMemo, useEffect } from 'react'
import CategorySection from '@/components/shopiing-list/CategorySection';
import ShoppingListHeader from '@/components/shopiing-list/ShoppingListHeader';
import QuickFilters from '@/components/shopiing-list/QuickFilters';
import ShoppingStats from '@/components/shopiing-list/ShoppingStats';
import Icon from '@/components/AppIcon';
import AddItemModal from '@/components/shopiing-list/AddItemModal';
import CreateListModal from '@/components/lists/CreateListModal';
import { NewShoppingItem, ShoppingItemType } from '@/types/all';
import GroceryLists from '@/components/lists/GroceryLists';
import { useLists } from '@/hooks/useLists';
import { useCategory } from '@/hooks/useCategory';
import { useItem } from '@/hooks/useItem';
import { useParams, useRouter } from 'next/navigation';

const ActiveShoppingList = () => {
    const params = useParams();
    const listId = params.id as string;
    const router = useRouter();

    const { lists, selectedList, selectedListId, loading, creating, error, selectList, createList } = useLists();
    const { categories, loading: categoryLoading } = useCategory()
    const { createItem, loading: itemLoading, error: itemError } = useItem();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showCreateListModal, setShowCreateListModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState<'category' | 'name' | 'priority' | 'alphabetical' | 'added'>('category');
    const [viewMode, setViewMode] = useState<'category' | 'list'>('category');
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    // State for local modifications to avoid setState in useEffect
    const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(new Set());
    const [addedItems, setAddedItems] = useState<ShoppingItemType[]>([]);
    const [deletedItemIds, setDeletedItemIds] = useState<Set<string>>(new Set());

    // Sync selectedListId with URL listId
    useEffect(() => {
        if (listId && listId !== selectedListId) {
            selectList(listId);
        }
    }, [listId, selectedListId, selectList]);

    // Derive items from selectedList with local modifications
    const items = useMemo(() => {
        if (!selectedList?.items) return [];
        const baseItems = selectedList.items.filter((item: ShoppingItemType) => item.id && !deletedItemIds.has(item.id));
        const modifiedItems = baseItems.map((item: ShoppingItemType) => ({
            ...item,
            completed: item.id && completedItemIds.has(item.id) ? !item.completed : item.completed
        }));
        return [...modifiedItems, ...addedItems];
    }, [selectedList, completedItemIds, addedItems, deletedItemIds]);

    // Filter and sort items
    const getFilteredItems = () => {
        let filtered = [...items];

        // Apply filters
        switch (activeFilter) {
            case 'pending':
                filtered = filtered?.filter(item => !item?.completed);
                break;
            case 'completed':
                filtered = filtered?.filter(item => item?.completed);
                break;
            case 'priority':
                filtered = filtered?.filter(item => item?.priority === 'high' && !item?.completed);
                break;
            default:
                break;
        }

        // Apply sorting
        switch (sortBy) {
            case 'priority':
                filtered?.sort((a, b) => {
                    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                    return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
                });
                break;
            case 'alphabetical':
                filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
                break;
            case 'added':
                filtered?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            default: // alphabetical
                filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
                break;
        }

        return filtered;
    };

    // Group items by category
    const getItemsByCategory = () => {
        const filtered = getFilteredItems();
        const grouped: Record<string, ShoppingItemType[]> = {};

        categories?.forEach(category => {
            grouped[category.id] = filtered?.filter(item => item?.categoryId === category?.id);
        });

        return grouped;
    };

    // Event handlers
    const handleItemToggle = (itemId?: string) => {
        if (!itemId) return;
        setCompletedItemIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleItemEdit = (item: ShoppingItemType) => {
        // TODO: Implement edit functionality
        console.log('Edit item:', item);
    };

    const handleItemDelete = (itemId?: string) => {
        if (!itemId) return;
        setDeletedItemIds(prev => new Set(prev).add(itemId));
    };

    const handleItemNote = (item: ShoppingItemType) => {
        // TODO: Implement note functionality
        console.log('Add note to item:', item);
    };

    const handleAddItem = async (newItem: NewShoppingItem) => {
        try {
            const itemData = {
                name: newItem.name,
                quantity: newItem.quantity,
                unit: newItem.unit,
                categoryId: newItem.categoryId,
                brand: newItem.brand,
                note: newItem.note,
                priority: newItem.priority,
                estimatedPrice: newItem.estimatedPrice,
                completed: false,
                listId: selectedListId
            };
            const createdItem = await createItem(itemData);
            setAddedItems(prev => [...prev, createdItem]);
            setShowAddModal(false)
        } catch (error) {
            console.error('Error adding item:', error);
            // TODO: Show error toast
        }
    };

    const handleCategoryToggle = (categoryId: string) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [categoryId]: !prev?.[categoryId]
        }));
    };

    const handleVoiceInput = () => {
        // TODO: Implement voice input
        console.log('Voice input activated');
    };

    const handleShareList = () => {
        // TODO: Implement list sharing
        console.log('Share list');
    };

    const handleListSettings = () => {
        // TODO: Implement list settings
        console.log('List settings');
    };

    const handleListSelect = (id: string) => {
        router.push(`/active-shopping-list/${id}`);
    };

    const filteredItems = getFilteredItems();
    const itemsByCategory = getItemsByCategory();
    const completedItems = items?.filter(item => item?.completed)?.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Icon name="Loader" size={48} className="text-text-secondary mx-auto mb-4 animate-spin" />
                    <p className="text-text-secondary">Loading shopping lists...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">Error loading lists</h3>
                    <p className="text-text-secondary mb-4">{error}</p>
                    <CustomeButton onClick={() => window.location.reload()}>
                        Try Again
                    </CustomeButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <div className={`fixed left-0 top-16 bottom-0 w-80 bg-surface border-r border-border transform transition-transform duration-300 z-40 lg:translate-x-0 lg:static lg:w-80`}>
                    <div className="h-full overflow-y-auto p-6">
                        {/* Sidebar List */}
                        <GroceryLists
                            list={lists}
                            loading={loading}
                            creating={creating}
                            selectedListId={selectedListId}
                            onListSelect={handleListSelect}
                            onAddList={() => setShowCreateListModal(true)} />
                    </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    <div className="max-w-7xl py-8">
                        {/* Shopping List Header */}
                        <ShoppingListHeader
                            listName={selectedList?.name || 'Shopping List'}
                            totalItems={items?.length}
                            completedItems={completedItems}
                            onAddItem={() => {
                                if (selectedList) {
                                    setShowAddModal(true);
                                } else {
                                    setShowCreateListModal(true);
                                }
                            }}
                            onVoiceInput={handleVoiceInput}
                            onShareList={handleShareList}
                            onListSettings={handleListSettings}
                        />

                        {/* Quick Filters */}
                        <QuickFilters
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />

                        {/* Shopping Stats */}
                        <ShoppingStats
                            items={filteredItems}
                            categories={categories}
                        />

                        {/* Main Content */}
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto">
                                {viewMode === 'category' ? (
                                    // Category View
                                    (<div className="space-y-4">
                                        {categories?.map(category => {
                                            const categoryItems = itemsByCategory?.[category?.id] || [];
                                            if (categoryItems?.length === 0 && activeFilter !== 'all') return null;

                                            return (
                                                <CategorySection
                                                    key={category?.id}
                                                    category={category}
                                                    items={categoryItems}
                                                    isCollapsed={collapsedCategories?.[category?.id]}
                                                    onToggleCollapse={() => handleCategoryToggle(category?.id)}
                                                    onItemToggle={handleItemToggle}
                                                    onItemEdit={handleItemEdit}
                                                    onItemDelete={handleItemDelete}
                                                    onItemNote={handleItemNote}
                                                />
                                            );
                                        })}
                                    </div>)
                                ) : (
                                    // List View
                                    (<div className="bg-surface rounded-lg border border-border overflow-hidden">
                                        <div className="divide-y divide-border">
                                            {filteredItems?.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <Icon name="ShoppingCart" size={48} className="text-text-secondary mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-text-primary mb-2">No items found</h3>
                                                    <p className="text-text-secondary mb-6">
                                                        {activeFilter === 'all'
                                                            ? "Your shopping list is empty. Add some items to get started!"
                                                            : `No items match the current filter: ${activeFilter}`
                                                        }
                                                    </p>
                                                    <CustomeButton
                                                        variant="default"
                                                        iconName="Plus"
                                                        iconPosition="left"
                                                        onClick={() => setShowAddModal(true)}
                                                    >
                                                        Add First Item
                                                    </CustomeButton>
                                                </div>
                                            ) : (
                                                filteredItems?.map(item => {
                                                    const category = categories?.find(c => c?.id === item?.categoryId);
                                                    return (
                                                        <div key={item?.id} className="p-4">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <div
                                                                    className="w-6 h-6 rounded flex items-center justify-center"
                                                                    style={{ backgroundColor: category?.color + '20' }}
                                                                >
                                                                    <Icon
                                                                        name={category?.icon || 'Package'}
                                                                        size={14}
                                                                        color={category?.color}
                                                                    />
                                                                </div>
                                                                <span className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                                                                    {category?.name}
                                                                </span>
                                                            </div>
                                                            {/* Item content would go here - using ShoppingItem component */}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>)
                                )}

                                {/* Empty State for Category View */}
                                {viewMode === 'category' && filteredItems?.length === 0 && (
                                    <div className="text-center py-12">
                                        <Icon name="ShoppingCart" size={64} className="text-text-secondary mx-auto mb-6" />
                                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                                            {activeFilter === 'all' ? 'Your shopping list is empty' : 'No items match your filter'}
                                        </h3>
                                        <p className="text-text-secondary mb-8 max-w-md mx-auto">
                                            {activeFilter === 'all'
                                                ? "Start building your shopping list by adding items. Organize them by categories for efficient shopping."
                                                : `Try adjusting your filter or add new items to see them here.`
                                            }
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                                            <CustomeButton
                                                variant="default"
                                                iconName="Plus"
                                                iconPosition="left"
                                                onClick={() => setShowAddModal(true)}
                                            >
                                                Add Items
                                            </CustomeButton>
                                            {activeFilter !== 'all' && (
                                                <CustomeButton
                                                    variant="outline"
                                                    iconName="X"
                                                    iconPosition="left"
                                                    onClick={() => setActiveFilter('all')}
                                                >
                                                    Clear Filter
                                                </CustomeButton>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Floating Action Button for Mobile */}
                        <CustomeButton
                            variant="default"
                            size="icon"
                            iconName="Plus"
                            onClick={() => {
                                if (selectedList) {
                                    setShowAddModal(true);
                                } else {
                                    setShowCreateListModal(true);
                                }
                            }}
                            className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-gentle lg:hidden z-40"
                        />
                        {/* Add Item Modal */}
                        <AddItemModal
                            isOpen={showAddModal}
                            listName={selectedList?.name}
                            onClose={() => setShowAddModal(false)}
                            onAddItem={handleAddItem}
                            categories={categories}
                            categoryLoading={categoryLoading}
                            loading={itemLoading}
                            error={itemError}
                        />
                        {/* Create List Modal */}
                        <CreateListModal
                            isOpen={showCreateListModal}
                            onClose={() => setShowCreateListModal(false)}
                            onCreateList={async (name, description) => {
                                await createList(name, description);
                                setShowAddModal(true);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveShoppingList
