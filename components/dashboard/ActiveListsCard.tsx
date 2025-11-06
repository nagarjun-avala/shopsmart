import React from "react";
import Icon from "@/components/AppIcon";
import Link from "next/link";
import { CustomeButton } from "@/components/ui/CustomeButton";

interface ActiveListsCardProps {
    activeLists?:
    {
        id: string
        category: string
        name: string
        items: number
        priority: string
        completed: number
        lastUpdated: string
        sharedWith: string[]
    }[]
    loading?: boolean
}

const SkeletonListItem = () => (
    <div className="breathing-card border border-border p-4">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="flex items-center space-x-4">
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-8 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3 animate-pulse"></div>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
        </div>
    </div>
);

const ActiveListsCard = ({ activeLists, loading = false }: ActiveListsCardProps) => {

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-500";
            case "medium":
                return "text-yellow-600";
            case "low":
                return "text-success";
            default:
                return "text-gray-500";
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "groceries":
                return "ShoppingCart";
            case "event":
                return "PartyPopper";
            case "household":
                return "Home";
            default:
                return "List";
        }
    };

    const getProgressPercentage = (completed: number, total: number) => {
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    return (
        <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="List" size={20} className="text-blue-500" />
                    <h2 className="text-lg font-bold text-primary">
                        Active Lists
                    </h2>
                </div>
                <Link href="/active-shopping-list">
                    <CustomeButton variant="ghost" size="sm" iconName="Plus" iconPosition="left" className="hover:bg-emerald-600 hover:text-white">
                        New List
                    </CustomeButton>
                </Link>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <>
                        <SkeletonListItem />
                        <SkeletonListItem />
                        <SkeletonListItem />
                    </>
                ) : activeLists && activeLists.length > 0 ? (
                    activeLists?.map((list) => (
                        <Link
                            key={list?.id}
                            href={`/active-shopping-list/${list.id}`}
                            className="block group"
                        >
                            <div className="breathing-card border border-border p-4 hover:border-blue-500/30 hover:shadow-xl shadow-blue-300/10 hover:scale-102 transition-all ease-in-out duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                            <Icon
                                                name={getCategoryIcon(list?.category)}
                                                size={18}
                                                className="text-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-primary group-hover:text-blue-500">
                                                {list?.name}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>{list?.items} items</span>
                                                <span>•</span>
                                                <span className={getPriorityColor(list?.priority)}>
                                                    {list?.priority} priority
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-primary">
                                            {getProgressPercentage(list?.completed, list?.items)}%
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {list?.completed}/{list?.items} done
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-muted rounded-full h-2 mb-3">
                                    <div
                                        className="bg-blue-500 rounded-full h-2"
                                        style={{
                                            width: `${getProgressPercentage(
                                                list?.completed,
                                                list?.items
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <Icon name="Clock" size={14} />
                                        <span>Updated {list?.lastUpdated}</span>
                                    </div>
                                    {list?.sharedWith?.length > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <Icon name="Users" size={14} />
                                            {/* TODO: show only 2 names & more if names list is > 3. show all names on tooltip*/}

                                            <span>Shared with {list?.sharedWith?.join(", ")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Icon name="List" size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No active lists</p>
                        <p className="text-sm">Create your first shopping list to get started</p>
                    </div>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
                <Link href="/active-shopping-list">
                    <CustomeButton
                        variant="outline"
                        fullWidth
                        iconName="Eye"
                        iconPosition="left"
                    >
                        View All Lists
                    </CustomeButton>
                </Link>
            </div>
        </div>
    );
};

export default ActiveListsCard;
