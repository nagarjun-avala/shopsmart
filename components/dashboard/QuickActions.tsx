"use client";
import React from "react";
import Icon from "@/components/AppIcon";
import Link from "next/link";
import { CustomeButton, buttonVariants } from "@/components/ui/CustomeButton";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];


interface QuickAction {
    label: string;
    icon: string;
    variant: ButtonVariant;
    path?: string;
    action?: string;
    description: string;
}

const quickActions: QuickAction[] = [
    {
        label: "New List",
        icon: "Plus",
        variant: "default",
        path: "/active-shopping-list",
        description: "Start fresh list",
    },
    {
        label: "Voice Add",
        icon: "Mic",
        variant: "outline",
        action: "voice",
        description: "Speak to add items",
    },
    {
        label: "Quick Shop",
        icon: "Zap",
        variant: "secondary",
        path: "/active-shopping-list",
        description: "Essential items only",
    },
    {
        label: "Share List",
        icon: "Share2",
        variant: "ghost",
        path: "/family-hub",
        description: "Send to family",
    },
];


const QuickActions = () => {

    const handleVoiceAction = () => {
        // Mock voice functionality
        alert("Voice input activated! (Mock functionality)");
    };

    return (
        <div className="bg-surface rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">
                    Quick Actions
                </h2>
                <Icon name="Zap" size={28} className="text-blue-500 hover:bg-blue-500/50 hover:text-white/50 p-1 rounded-full cursor-pointer transition-colors ease-in-out" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions?.map((action, index) => (
                    <div key={index} className="group">
                        {action?.path ? (
                            <Link href={action?.path} className="block">
                                <div className="breathing-card bg-muted/50 hover:bg-muted rounded-lg p-4 text-center calm-transition">
                                    <CustomeButton
                                        variant={action?.variant}
                                        size="icon"
                                        iconName={action?.icon}
                                        className="mb-2 mx-auto"
                                    />
                                    <div className="text-sm font-medium text-text-primary mb-1">
                                        {action?.label}
                                    </div>
                                    <div className="text-xs text-text-secondary">
                                        {action?.description}
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div
                                onClick={handleVoiceAction}
                                className="breathing-card bg-muted/50 hover:bg-muted rounded-lg p-4 text-center calm-transition cursor-pointer"
                            >
                                <CustomeButton
                                    variant={action?.variant}
                                    size="icon"
                                    iconName={action?.icon}
                                    className="mb-2 mx-auto"
                                />
                                <div className="text-sm font-medium text-text-primary mb-1">
                                    {action?.label}
                                </div>
                                <div className="text-xs text-text-secondary">
                                    {action?.description}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
