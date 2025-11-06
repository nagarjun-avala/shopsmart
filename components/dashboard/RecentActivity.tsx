import React from "react";
import Icon from "@/components/AppIcon";
import { CustomeButton } from "@/components/ui/CustomeButton";
import Link from "next/link";

interface RecentActivityProps {
    loading?: boolean
    activities?: {
        id: string;
        type: string;
        title: string;
        description: string;
        timestamp: string;
        user: string;
    }[]
}

const RecentActivity = ({ activities = [], loading = false }: RecentActivityProps) => {

    const getActivityTypeLabel = (type: string) => {
        switch (type) {
            case "comment":
                return "Comment";
            default:
                return "Activity";
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "comment":
                return "MessageCircle";
            default:
                return "Activity";
        }
    };

    const getActivityIconColor = (type: string) => {
        switch (type) {
            case "comment":
                return "text-blue-500";
            default:
                return "text-gray-500";
        }
    };

    if (loading) {
        return (
            <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Icon name="Activity" size={20} className="text-blue-600" />
                        <h2 className="text-lg font-semibold text-primary">
                            Recent Activity
                        </h2>
                    </div>
                    <Link href="/shopping-history">
                        <CustomeButton
                            variant="ghost"
                            size="sm"
                            iconName="ExternalLink"
                            iconPosition="right"
                        >
                            View All
                        </CustomeButton>
                    </Link>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-64 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="Activity" size={20} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-primary">
                        Recent Activity
                    </h2>
                </div>
                <Link href="/shopping-history">
                    <CustomeButton
                        variant="ghost"
                        size="sm"
                        iconName="ExternalLink"
                        iconPosition="right"
                    >
                        View All
                    </CustomeButton>
                </Link>
            </div>
            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-8">
                        <Icon name="Activity" size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent activity</p>
                        <p className="text-sm text-gray-400">Activity will appear here as you shop</p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <div key={activity.id} className="flex items-start space-x-4 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                    <Icon
                                        name={getActivityIcon(activity.type)}
                                        size={18}
                                        className={getActivityIconColor(activity.type)}
                                    />
                                </div>
                                {index < activities.length - 1 && (
                                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-6 bg-border" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-medium text-primary group-hover:text-blue-600 calm-transition">
                                        {activity.title}
                                    </h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                        {new Date(activity.timestamp).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 mb-2">
                                    {activity.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-gray-400">
                                            {getActivityTypeLabel(activity.type)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            by {activity.user}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-center">
                    <Link href="/shopping-history">
                        <CustomeButton
                            variant="outline"
                            size="sm"
                            iconName="History"
                            iconPosition="left"
                        >
                            View Complete History
                        </CustomeButton>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
