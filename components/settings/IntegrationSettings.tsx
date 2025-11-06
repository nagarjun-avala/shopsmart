"use client";
import React, { useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingItem from './SettingItem';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import { Button } from '../ui/button';

type IntegrationsState = {
    googleCalendar: boolean;
    amazonFresh: boolean;
    instacart: boolean;
    walmart: boolean;
    target: boolean;
    wholefoods: boolean;
};

type Integration = {
    id: keyof IntegrationsState;
    name: string;
    description: string;
    icon: string;
    logo: string;
    logoAlt: string;
    category: string;
    connected: boolean;
};

const IntegrationSettings = () => {
    const [integrations, setIntegrations] = useState<IntegrationsState>({
        googleCalendar: false,
        amazonFresh: true,
        instacart: false,
        walmart: true,
        target: false,
        wholefoods: false
    });

    const availableIntegrations: Integration[] = [
        {
            id: 'googleCalendar',
            name: 'Google Calendar',
            description: 'Sync shopping reminders with your calendar',
            icon: 'Calendar',
            logo: "https://images.unsplash.com/photo-1729860648922-a79abb2fbcf0",
            logoAlt: 'Google Calendar colorful logo with calendar grid icon',
            category: 'Productivity',
            connected: integrations.googleCalendar
        },
        {
            id: 'amazonFresh',
            name: 'Amazon Fresh',
            description: 'Order groceries directly from your shopping lists',
            icon: 'ShoppingBag',
            logo: "https://images.unsplash.com/photo-1566703603617-2960722e85b5",
            logoAlt: 'Amazon Fresh delivery service logo with shopping bag icon',
            category: 'Grocery Delivery',
            connected: integrations.amazonFresh
        },
        {
            id: 'instacart',
            name: 'Instacart',
            description: 'Same-day grocery delivery from local stores',
            icon: 'Truck',
            logo: "https://images.unsplash.com/photo-1648091855459-5f41adebbc77",
            logoAlt: 'Instacart grocery delivery service logo with shopping cart icon',
            category: 'Grocery Delivery',
            connected: integrations.instacart
        },
        {
            id: 'walmart',
            name: 'Walmart Grocery',
            description: 'Pickup and delivery from Walmart stores',
            icon: 'Store',
            logo: "https://images.unsplash.com/photo-1499217960377-94dba34c3cd8",
            logoAlt: 'Walmart store logo with blue and yellow branding',
            category: 'Retail',
            connected: integrations.walmart
        },
        {
            id: 'target',
            name: 'Target',
            description: 'Order for pickup or delivery from Target',
            icon: 'Target',
            logo: "https://images.unsplash.com/photo-1607016552642-b667f4a0a4e2",
            logoAlt: 'Target retail store logo with red bullseye design',
            category: 'Retail',
            connected: integrations.target
        },
        {
            id: 'wholefoods',
            name: 'Whole Foods',
            description: 'Organic and natural grocery delivery',
            icon: 'Leaf',
            logo: "https://images.unsplash.com/photo-1614695639449-b305bfe37142",
            logoAlt: 'Whole Foods Market logo with green leaf and natural branding',
            category: 'Organic',
            connected: integrations.wholefoods
        }];


    const recipeIntegrations = [
        {
            id: 'allrecipes',
            name: 'Allrecipes',
            description: 'Import ingredients from recipes automatically',
            logo: "https://images.unsplash.com/photo-1659354218899-6ace948e4a58",
            logoAlt: 'Allrecipes cooking website logo with chef hat and recipe book',
            connected: false
        },
        {
            id: 'foodnetwork',
            name: 'Food Network',
            description: 'Add ingredients from Food Network recipes',
            logo: "https://images.unsplash.com/photo-1609054060825-32fa9385842f",
            logoAlt: 'Food Network television channel logo with cooking utensils',
            connected: true
        },
        {
            id: 'yummly',
            name: 'Yummly',
            description: 'Sync meal plans with shopping lists',
            logo: "https://images.unsplash.com/photo-1663000807115-9c355ea96b18",
            logoAlt: 'Yummly recipe app logo with colorful food photography',
            connected: false
        }];


    const toggleIntegration = (integrationId: keyof IntegrationsState) => {
        setIntegrations((prev) => ({
            ...prev,
            [integrationId]: !prev[integrationId]
        }));
    };

    const handleConnect = (integrationId: keyof IntegrationsState) => {
        // Handle connection logic
        toggleIntegration(integrationId);
    };

    const handleDisconnect = (integrationId: keyof IntegrationsState) => {
        // Handle disconnection logic
        toggleIntegration(integrationId);
    };

    const groupedIntegrations = availableIntegrations.reduce((acc: Record<string, Integration[]>, integration) => {
        if (!acc[integration.category]) {
            acc[integration.category] = [];
        }
        acc[integration.category].push(integration);
        return acc;
    }, {});

    return (
        <SettingsSection
            title="Integrations & Connections"
            description="Connect ShopSmart with your favorite apps and services"
            icon="Link">

            {/* Connected Services Overview */}
            <div className="bg-linear-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-primary mb-1">Connected Services</h3>
                        <p className="text-sm text-gray-500">
                            {Object.values(integrations)?.filter(Boolean)?.length} of {availableIntegrations?.length} services connected
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon name="CheckCircle" size={20} className="text-success" />
                        <span className="text-sm font-medium text-success">Active</span>
                    </div>
                </div>
            </div>
            {/* Grocery & Delivery Services */}
            {Object.entries(groupedIntegrations)?.map(([category, categoryIntegrations]) =>
                <div key={category} className="mb-8">
                    <h3 className="font-medium text-primary mb-4">{category}</h3>
                    <div className="space-y-3">
                        {categoryIntegrations?.map((integration) =>
                            <div key={integration?.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/50">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Image
                                            src={integration?.logo}
                                            alt={integration?.logoAlt}
                                            className="w-10 h-10 rounded-lg object-cover" />

                                        {integration?.connected &&
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                                                <Icon name="Check" size={10} className="text-white" />
                                            </div>
                                        }
                                    </div>
                                    <div>
                                        <div className="font-medium text-primary">{integration?.name}</div>
                                        <div className="text-sm text-gray-500">{integration?.description}</div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {integration?.connected ?
                                        <>
                                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                                                Connected
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDisconnect(integration?.id)}>

                                                Disconnect
                                            </Button>
                                        </> :

                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleConnect(integration?.id)}>

                                            Connect
                                        </Button>
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Recipe Integrations */}
            <div className="border-t border-border pt-6">
                <h3 className="font-medium text-primary mb-4">Recipe Platforms</h3>
                <div className="space-y-3">
                    {recipeIntegrations?.map((integration) =>
                        <div key={integration?.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/50">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Image
                                        src={integration?.logo}
                                        alt={integration?.logoAlt}
                                        className="w-10 h-10 rounded-lg object-cover" />

                                    {integration?.connected &&
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                                            <Icon name="Check" size={10} className="text-white" />
                                        </div>
                                    }
                                </div>
                                <div>
                                    <div className="font-medium text-primary">{integration?.name}</div>
                                    <div className="text-sm text-gray-500">{integration?.description}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {integration?.connected ?
                                    <>
                                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                                            Connected
                                        </span>
                                        <Button variant="outline" size="sm">
                                            Disconnect
                                        </Button>
                                    </> :

                                    <Button variant="default" size="sm">
                                        Connect
                                    </Button>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* API & Developer Settings */}
            <div className="border-t border-border pt-6">
                <h3 className="font-medium text-primary mb-4">Developer Options</h3>

                <SettingItem
                    label="API Access"
                    description="Generate API keys for custom integrations"
                    icon="Code"
                    value=""
                    action={<Button variant="outline" size="sm">Open</Button>}
                    showArrow
                    onClick={() => console.log('Open API settings')} />


                <SettingItem
                    label="Webhooks"
                    description="Configure webhooks for real-time updates"
                    icon="Webhook"
                    value=""
                    action={<Button variant="outline" size="sm">Configure</Button>}
                    showArrow
                    onClick={() => console.log('Open webhook settings')} />


                <SettingItem
                    label="Export Data"
                    description="Download your data in various formats"
                    icon="Download"
                    action={
                        <Button variant="outline" size="sm">
                            Export
                        </Button>
                    }
                    showArrow
                />

            </div>
            {/* Integration Help */}
            <div className="border-t border-border pt-6">
                <div className="bg-blue-50 dark:bg-primary-foreground border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Icon name="HelpCircle" size={16} className="text-blue-600 dark:text-primary mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <p className="text-blue-800 dark:text-primary font-medium mb-1">Need help with integrations?</p>
                            <p className="text-blue-700 dark:text-primary mb-3">
                                Our integration guide walks you through connecting your favorite services step by step.
                            </p>
                            <Button variant="outline" size="sm" className="text-blue-700 dark:text-primary border-blue-300 hover:bg-blue-100">
                                View Integration Guide
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsSection>);

};

export default IntegrationSettings;