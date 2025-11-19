import React from 'react';
import Button from '../../../components/ui/Button';


const NewsFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  sortBy, 
  onSortChange,
  onClearFilters 
}) => {
  const categories = [
    { value: 'all', label: 'All News', icon: 'Newspaper' },
    { value: 'Policy', label: 'Policy Updates', icon: 'FileText' },
    { value: 'Banking', label: 'Banking Services', icon: 'Building2' },
    { value: 'Economy', label: 'Economic News', icon: 'TrendingUp' },
    { value: 'Regulation', label: 'Regulations', icon: 'Shield' },
    { value: 'Technology', label: 'Technology', icon: 'Cpu' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: 'ArrowDown' },
    { value: 'oldest', label: 'Oldest First', icon: 'ArrowUp' },
    { value: 'popular', label: 'Most Popular', icon: 'Heart' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Categories */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <h3 className="text-sm font-medium text-card-foreground">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <Button
                key={category?.value}
                variant={selectedCategory === category?.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category?.value)}
                iconName={category?.icon}
                iconPosition="left"
                iconSize={14}
                className="text-xs"
              >
                {category?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort and Clear */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-card-foreground">Sort by:</span>
            <div className="flex space-x-1">
              {sortOptions?.map((option) => (
                <Button
                  key={option?.value}
                  variant={sortBy === option?.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onSortChange(option?.value)}
                  iconName={option?.icon}
                  iconPosition="left"
                  iconSize={14}
                  className="text-xs"
                >
                  {option?.label}
                </Button>
              ))}
            </div>
          </div>

          {(selectedCategory !== 'all' || sortBy !== 'newest') && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFilters;