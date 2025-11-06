import React from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';
import Image from '@/components/AppImage';

const FrequencyTracker = () => {
  const mockFrequentItems = [
    {
      id: 'freq-001',
      name: 'Whole Milk',
      category: 'Dairy',
      image: "https://images.unsplash.com/photo-1735493234230-f75f13e0d3db",
      imageAlt: 'White plastic milk jug with blue cap on clean background',
      frequency: 'Every 4 days',
      lastPurchased: '2024-10-12',
      avgPrice: 4.29,
      nextSuggested: '2024-10-16',
      trend: 'stable',
      purchaseCount: 24,
      daysUntilNext: 2
    },
    {
      id: 'freq-002',
      name: 'Organic Bananas',
      category: 'Produce',
      image: "https://images.unsplash.com/photo-1565804212260-280f967e431b",
      imageAlt: 'Fresh yellow bananas in a bunch on white background',
      frequency: 'Every 6 days',
      lastPurchased: '2024-10-10',
      avgPrice: 3.98,
      nextSuggested: '2024-10-16',
      trend: 'increasing',
      purchaseCount: 18,
      daysUntilNext: 2
    },
    {
      id: 'freq-003',
      name: 'Bread - Whole Wheat',
      category: 'Bakery',
      image: "https://images.unsplash.com/photo-1596662841962-34034e1e6efc",
      imageAlt: 'Sliced whole wheat bread loaf on wooden cutting board',
      frequency: 'Every 7 days',
      lastPurchased: '2024-10-09',
      avgPrice: 2.89,
      nextSuggested: '2024-10-16',
      trend: 'stable',
      purchaseCount: 15,
      daysUntilNext: 2
    },
    {
      id: 'freq-004',
      name: 'Greek Yogurt',
      category: 'Dairy',
      image: "https://images.unsplash.com/photo-1570649857669-4ad9f896435d",
      imageAlt: 'White plastic containers of Greek yogurt stacked on refrigerated shelf',
      frequency: 'Every 5 days',
      lastPurchased: '2024-10-11',
      avgPrice: 5.99,
      nextSuggested: '2024-10-16',
      trend: 'decreasing',
      purchaseCount: 20,
      daysUntilNext: 2
    },
    {
      id: 'freq-005',
      name: 'Ground Beef 80/20',
      category: 'Meat',
      image: "https://images.unsplash.com/photo-1617813833669-8ad4397b9239",
      imageAlt: 'Fresh ground beef in clear plastic packaging on white surface',
      frequency: 'Every 10 days',
      lastPurchased: '2024-10-08',
      avgPrice: 12.98,
      nextSuggested: '2024-10-18',
      trend: 'stable',
      purchaseCount: 12,
      daysUntilNext: 4
    },
    {
      id: 'freq-006',
      name: 'Chicken Breast',
      category: 'Meat',
      image: "https://images.unsplash.com/photo-1682991136736-a2b44623eeba",
      imageAlt: 'Fresh raw chicken breast fillets on white butcher paper',
      frequency: 'Every 8 days',
      lastPurchased: '2024-10-07',
      avgPrice: 18.75,
      nextSuggested: '2024-10-15',
      trend: 'increasing',
      purchaseCount: 16,
      daysUntilNext: 1
    }];


  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return { icon: 'TrendingUp', color: 'text-green-600' };
      case 'decreasing':
        return { icon: 'TrendingDown', color: 'text-red-600' };
      default:
        return { icon: 'Minus', color: 'text-gray-600' };
    }
  };

  const getUrgencyColor = (daysUntilNext: number) => {
    if (daysUntilNext <= 1) return 'bg-red-50 border-red-200 text-red-800';
    if (daysUntilNext <= 3) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-green-50 border-green-200 text-green-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Frequently Purchased Items</h3>
          <p className="text-sm text-text-secondary">Items you buy regularly with purchase predictions</p>
        </div>
        <CustomeButton
          variant="outline"
          size="sm"
          iconName="Settings"
          iconPosition="left">

          Customize
        </CustomeButton>
      </div>
      <div className="space-y-4">
        {mockFrequentItems?.map((item) => {
          const trendInfo = getTrendIcon(item?.trend);
          const urgencyClass = getUrgencyColor(item?.daysUntilNext);

          return (
            <div key={item?.id} className="breathing-card p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item?.image}
                      alt={item?.imageAlt}
                      className="w-full h-full object-cover" />

                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-text-primary">{item?.name}</h4>
                      <Icon
                        name={trendInfo?.icon}
                        size={16}
                        className={trendInfo?.color} />

                    </div>
                    <p className="text-sm text-text-secondary mb-2">{item?.category} • Avg ${item?.avgPrice}</p>

                    <div className="flex items-center space-x-4 text-xs text-text-secondary">
                      <span>Purchased {item?.purchaseCount} times</span>
                      <span>•</span>
                      <span>Every {item?.frequency?.toLowerCase()}</span>
                      <span>•</span>
                      <span>Last: {formatDate(item?.lastPurchased)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full border text-xs font-medium ${urgencyClass}`}>
                    {item?.daysUntilNext === 0 ? 'Due Today' :
                      item?.daysUntilNext === 1 ? 'Due Tomorrow' :
                        `${item?.daysUntilNext} days left`}
                  </div>

                  <CustomeButton
                    variant="ghost"
                    size="sm"
                    iconName="Plus"
                    onClick={() => console.log('Add to list:', item?.name)}
                    className="text-brand-primary hover:text-brand-primary">

                    Add
                  </CustomeButton>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                  <span>Purchase Cycle Progress</span>
                  <span>Next suggested: {formatDate(item?.nextSuggested)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${item?.daysUntilNext <= 1 ? 'bg-red-500' :
                      item?.daysUntilNext <= 3 ? 'bg-yellow-500' : 'bg-green-500'}`
                    }
                    style={{
                      width: `${Math.max(10, 100 - item?.daysUntilNext / 10 * 100)}%`
                    }}>
                  </div>
                </div>
              </div>
            </div>);

        })}
      </div>
      {/* View All Custome Button */}
      <div className="text-center mt-6 pt-4 border-t border-border">
        <CustomeButton
          variant="outline"
          iconName="Eye"
          iconPosition="left">

          View All Frequent Items
        </CustomeButton>
      </div>
    </div>);

};

export default FrequencyTracker;