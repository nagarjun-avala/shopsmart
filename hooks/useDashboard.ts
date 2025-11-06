import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';

interface DashboardData {
    user: {
        id: string;
        name: string;
        email: string;
    };
    stats: {
        thisWeekSpendings: number;
        avgTripTime: number;
        activeListsCount: number;
    };
    activeLists: Array<{
        id: string;
        category: string;
        name: string;
        items: number;
        priority: string;
        completed: number;
        lastUpdated: string;
        sharedWith: string[];
    }>;
    recentActivities: Array<{
        id: string;
        type: string;
        title: string;
        description: string;
        timestamp: string;
        user: string;
    }>;
    familyMembers: Array<{
        id: string;
        name: string;
        email: string;
        status: string;
    }>;
    smartSuggestions: Array<{
        id: string;
        item: string;
        reason: string;
        confidence: number;
        category: string;
        lastBought: string;
        avgPrice: number;
    }>;
    insights: {
        savings: { value: number; change: string };
        spendingTrend: { value: number; change: string };
        tip: string;
    };
}

export const useDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch('/api/dashboard', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const dashboardData = await response.json();
                setData(dashboardData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    return { data, loading, error, refetch: () => setData(null) };
};
