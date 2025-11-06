import { usePathname } from 'next/navigation';
import Icon from './AppIcon';
import Link from 'next/link';
import { CustomeButton } from './ui/CustomeButton';

interface SidebarProps {
    isCollapsed?: boolean;
    isMenuOpen?: boolean;
    setIsMenuOpen: (open: boolean) => void;
    onToggle: () => void;
}

const Sidebar = ({ isCollapsed, isMenuOpen, setIsMenuOpen, onToggle }: SidebarProps) => {
    const pathname = usePathname();

    const navigationItems = [
        {
            section: "Main",
            items: [
                {
                    path: "/",
                    label: "Dashboard",
                    icon: "LayoutDashboard",
                    description: "Overview & insights",
                },
                {
                    path: "/active-shopping-list",
                    label: "Shopping List",
                    icon: "ShoppingCart",
                    description: "Current list",
                },
                {
                    path: "/category-manager",
                    label: "Categories",
                    icon: "FolderOpen",
                    description: "Organize items",
                },
                {
                    path: "/family-hub",
                    label: "Family Hub",
                    icon: "Users",
                    description: "Shared lists",
                },
            ],
        },
        {
            section: "Tools",
            items: [
                {
                    path: "/shopping-history",
                    label: "History",
                    icon: "History",
                    description: "Past purchases",
                },
                {
                    path: "/settings",
                    label: "Settings",
                    icon: "Settings",
                    description: "Preferences",
                },
            ],
        },
    ];

    const isActivePath = (path: string) => pathname === path;

    const toggleSidebar = () => {
        if (onToggle) {
            onToggle();
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    const sidebarWidth = isCollapsed ? "w-16" : "w-64";
    const mobileClass = isMenuOpen ? "translate-x-0" : "-translate-x-full";
    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
        fixed top-16 left-0 bottom-0 z-50 bg-surface border-r border-border
        ${sidebarWidth} transition-all duration-300 ease-out
        lg:translate-x-0 ${mobileClass}
      `}
            >
                <div className="flex flex-col h-full">
                    {/* Toggle Button */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        {!isCollapsed && (
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Navigation
                            </h2>
                        )}
                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
                            onClick={toggleSidebar}
                            className="text-gray-600 hover:text-blue-500 lg:flex hidden"
                        />
                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName="X"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-600 hover:text-blue-500 lg:hidden"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        {navigationItems?.map((section) => (
                            <div key={section?.section} className="mb-6">
                                {!isCollapsed && (
                                    <h3 className="px-4 mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        {section?.section}
                                    </h3>
                                )}

                                <div className="space-y-1 px-2">
                                    {section?.items?.map((item) => (
                                        <Link
                                            key={item?.path}
                                            href={item?.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`
                        group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium calm-transition
                        ${isActivePath(item?.path)
                                                    ? "bg-blue-500/10 text-blue-600 shadow-soft"
                                                    : "text-gray-500 hover:text-primary hover:bg-muted"
                                                }
                      `}
                                            title={isCollapsed ? item?.label : ""}
                                        >
                                            <Icon
                                                name={item?.icon}
                                                size={20}
                                                className={`
                          ${isCollapsed ? "mx-auto" : "mr-3"}
                          ${isActivePath(item?.path)
                                                        ? "text-blue-500"
                                                        : "text-current"
                                                    }
                        `}
                                            />

                                            {!isCollapsed && (
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium">{item?.label}</div>
                                                    <div className="text-xs text-gray-600/70 group-hover:text-gray-600 calm-transition">
                                                        {item?.description}
                                                    </div>
                                                </div>
                                            )}

                                            {!isCollapsed && isActivePath(item?.path) && (
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-border">
                        {!isCollapsed ? (
                            <div className="breathing-card bg-linear-to-r from-brand-primary/5 to-brand-secondary/5 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Icon
                                        name="Sparkles"
                                        size={16}
                                        className="text-brand-primary"
                                    />
                                    <span className="text-xs font-semibold text-blue-500">
                                        Smart Tips
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Your shopping patterns show you save 15 minutes per trip with
                                    smart suggestions.
                                </p>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Icon
                                    name="Sparkles"
                                    size={20}
                                    className="text-brand-primary"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </aside>
            {/* Mobile Toggle Button */}
            {/* <Button
        variant="ghost"
        size="icon"
        iconName="Menu"
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 bg-surface shadow-gentle"
      /> */}
        </>
    );
}

export default Sidebar