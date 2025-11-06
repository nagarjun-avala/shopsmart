import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
        name: string;
        itemsCount: number;
        completedCount: number;
        sharedWith: number;
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

interface DashboardContextType {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const refetch = () => {
        setData(null);
        fetchDashboardData();
    };

    const value: DashboardContextType = {
        data,
        loading,
        error,
        refetch,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
