import React from 'react';
import Icon from '../../../components/AppIcon';

const NewsStats = ({ totalArticles, filteredCount, searchQuery, selectedCategory }) => {
  const getStatsText = () => {
    if (searchQuery && selectedCategory !== 'all') {
      return `${filteredCount} articles found for "${searchQuery}" in ${selectedCategory}`;
    } else if (searchQuery) {
      return `${filteredCount} articles found for "${searchQuery}"`;
    } else if (selectedCategory !== 'all') {
      return `${filteredCount} articles in ${selectedCategory}`;
    } else {
      return `${totalArticles} total articles`;
    }
  };

  const stats = [
    {
      icon: 'FileText',
      label: 'Total Articles',
      value: totalArticles,
      color: 'text-primary'
    },
    {
      icon: 'Filter',
      label: 'Filtered Results',
      value: filteredCount,
      color: 'text-secondary'
    },
    {
      icon: 'Calendar',
      label: 'This Month',
      value: Math.floor(totalArticles * 0.3),
      color: 'text-success'
    },
    {
      icon: 'TrendingUp',
      label: 'Popular',
      value: Math.floor(totalArticles * 0.15),
      color: 'text-accent'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Main Stats Text */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">News Overview</h3>
            <p className="text-sm text-muted-foreground">{getStatsText()}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Icon name={stat?.icon} size={16} className={stat?.color} />
                <span className={`text-lg font-bold ${stat?.color}`}>{stat?.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsStats;