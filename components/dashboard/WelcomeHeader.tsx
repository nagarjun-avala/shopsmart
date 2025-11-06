import React from "react";
import Icon from "@/components/AppIcon";
import { formatCurrency } from "@/lib/currency";
import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";

interface WelcomeHeaderProps {
    name?: string;
    activeListsCount?: number;
    thisWeekSpendings?: number;
    avgTripTime?: number;
    loading?: boolean;
    logout: () => Promise<void>;
}

const WelcomeHeader = ({ name = "Admin", activeListsCount = 0, thisWeekSpendings = 0, avgTripTime = 0, loading = false, logout }: WelcomeHeaderProps) => {
    const now = new Date();

    const getGreeting = (date = now) => {
        const hour = date.getHours();
        const day = date.getDay();

        if (day === 0 || day === 6) {
            if (hour >= 5 && hour < 12) return "Happy weekend morning";
            if (hour >= 12 && hour < 15) return "Enjoy your weekend afternoon";
            if (hour >= 15 && hour < 18) return "Relax this weekend evening";
            if (hour >= 18 && hour < 21)
                return "Unwind, it's a peaceful weekend night";
            return "Rest well this weekend";
        }

        if (hour >= 0 && hour < 5) return "It's late; hope you're resting well.";
        if (hour >= 5 && hour < 8) return "Rise and shine Good morning";
        if (hour >= 8 && hour < 12) return "Good morning";
        if (hour === 12) return "Good noon";
        if (hour > 12 && hour < 15) return "Good afternoon";
        if (hour >= 15 && hour < 18) return "Hope your afternoon's going well";
        if (hour >= 18 && hour < 21) return "Good evening";
        if (hour >= 21 && hour <= 23) return "Good night";

        return "Hello!";
    };

    const getGreetingIcon = (date = now) => {
        const hour = date.getHours();
        const day = date.getDay();

        if (day === 0 || day === 6) {
            if (hour >= 5 && hour < 12) return "Sun";
            if (hour >= 12 && hour < 18) return "CloudSun";
            return "Moon";
        }

        if (hour >= 0 && hour < 5) return "MoonStars";
        if (hour >= 5 && hour < 8) return "Sunrise";
        if (hour >= 8 && hour < 12) return "Sun";
        if (hour === 12) return "Sun";
        if (hour > 12 && hour < 15) return "CloudSun";
        if (hour >= 15 && hour < 18) return "Cloud";
        if (hour >= 18 && hour < 21) return "Sunset";
        if (hour >= 21 && hour <= 23) return "Moon";

        return "Bell";
    };

    if (loading) {
        return (
            <div className="bg-linear-to-r from-gray-200/10 to-gray-400/10 rounded-xl p-6 mb-8">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-48"></div>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="text-center">
                                <div className="h-6 bg-gray-300 rounded w-16 mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-12"></div>
                            </div>
                            <div className="text-center">
                                <div className="h-6 bg-gray-300 rounded w-12 mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-linear-to-r from-gray-200/10 to-gray-400/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <Icon
                            name={getGreetingIcon()}
                            size={24}
                            className="text-blue-500"
                        />
                        <h1 className="text-2xl font-semibold text-primary">
                            {getGreeting()}, {name || "Admin"} 🎉!
                        </h1>
                        <Button
                            onClick={logout}
                            variant={"destructive"}
                            className="capitalize ml-4 flex items-center space-x-2 px-3 py-1 text-sm cursor-pointer"
                        >
                            <LogOutIcon /> Logout
                        </Button>
                    </div>
                    <p className="text-gray-500">
                        You have {activeListsCount} active list{activeListsCount !== 1 ? 's' : ''} ready for your next shopping trip.
                    </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                            {formatCurrency(thisWeekSpendings)}
                        </div>
                        <div className="text-xs text-gray-500">This week</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-500">{avgTripTime}min</div>
                        <div className="text-xs text-gray-500">Avg. trip</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeHeader;
