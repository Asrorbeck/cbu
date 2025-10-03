import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NewsSearch = ({ onSearch, searchQuery, onClearSearch }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSearch(localQuery?.trim());
  };

  const handleClear = () => {
    setLocalQuery('');
    onClearSearch();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search news articles, policies, or announcements..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="submit"
            variant="default"
            iconName="Search"
            iconPosition="left"
            iconSize={16}
            disabled={!localQuery?.trim()}
          >
            Search
          </Button>
          
          {searchQuery && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear
            </Button>
          )}
        </div>
      </form>
      {searchQuery && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Search" size={14} />
          <span>Showing results for: <strong className="text-card-foreground">"{searchQuery}"</strong></span>
        </div>
      )}
    </div>
  );
};

export default NewsSearch;