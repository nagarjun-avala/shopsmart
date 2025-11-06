import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import Icon from './AppIcon';
import { CustomeButton } from './ui/CustomeButton';

const Logo = () => (
    <Link href="/" className="flex items-center space-x-2 group">
        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-soft">
            <Icon name="ShoppingBag" size={20} color="white" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-semibold text-text-primary group-hover:text-brand-primary calm-transition">
            ShopSmart
        </span>
    </Link>
);

interface HeaderProps {
    isMenuOpen?: boolean;
    setIsMenuOpen: (open: boolean) => void;
}

const Header = ({ isMenuOpen = false, setIsMenuOpen }: HeaderProps) => {
    const pathname = usePathname();

    const primaryNavItems = [
        { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
        {
            path: "/active-shopping-list",
            label: "Shopping List",
            icon: "ShoppingCart",
        },
        { path: "/category-manager", label: "Categories", icon: "FolderOpen" },
        { path: "/family-hub", label: "Family Hub", icon: "Users" },
    ];

    const secondaryNavItems = [
        { path: "/shopping-history", label: "History", icon: "History" },
        { path: "/settings", label: "Settings", icon: "Settings" },
    ];

    const isActivePath = (path: string) => pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between h-16 px-6">
                <Logo />

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {primaryNavItems?.map((item) => (
                        <Link
                            key={item?.path}
                            href={item?.path}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium calm-transition ${isActivePath(item?.path)
                                ? "bg-primary/10 text-primary"
                                : "text-text-secondary hover:text-text-primary hover:bg-muted"
                                }`}
                        >
                            <Icon name={item?.icon} size={18} />
                            <span>{item?.label}</span>
                        </Link>
                    ))}

                    {/* More Menu */}
                    <div className="relative">
                        <CustomeButton
                            variant="ghost"
                            size="sm"
                            iconName="MoreHorizontal"
                            iconPosition="left"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-text-secondary hover:text-text-primary"
                        >
                            More
                        </CustomeButton>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-gentle py-2 z-50">
                                {secondaryNavItems?.map((item) => (
                                    <Link
                                        key={item?.path}
                                        href={item?.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-2 text-sm calm-transition ${isActivePath(item?.path)
                                            ? "bg-primary/10 text-primary"
                                            : "text-text-secondary hover:text-text-primary hover:bg-muted"
                                            }`}
                                    >
                                        <Icon name={item?.icon} size={16} />
                                        <span>{item?.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu CustomeButton */}
                {!isMenuOpen && (
                    <CustomeButton
                        variant="ghost"
                        size="icon"
                        iconName="Menu"
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden text-text-secondary hover:text-text-primary"
                    />
                )}
            </div>
        </header>
    )
}

export default Header