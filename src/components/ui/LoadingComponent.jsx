import React from 'react';

const LoadingComponent = ({ 
  type = 'default', 
  className = '',
  count = 3,
  showText = true 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-xl loading-skeleton"></div>
              <div className="space-y-2 w-full">
                <div className="h-5 bg-muted rounded loading-skeleton w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted rounded loading-skeleton w-full"></div>
                <div className="h-4 bg-muted rounded loading-skeleton w-5/6 mx-auto"></div>
              </div>
              <div className="h-4 bg-muted rounded loading-skeleton w-1/2"></div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count })?.map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 bg-muted rounded-lg loading-skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded loading-skeleton w-3/4"></div>
                  <div className="h-3 bg-muted rounded loading-skeleton w-1/2"></div>
                </div>
                <div className="w-8 h-8 bg-muted rounded loading-skeleton"></div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
            <div className="p-4 border-b border-border">
              <div className="h-6 bg-muted rounded loading-skeleton w-1/4"></div>
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: count })?.map((_, index) => (
                <div key={index} className="p-4 flex items-center space-x-4">
                  <div className="h-4 bg-muted rounded loading-skeleton w-1/6"></div>
                  <div className="h-4 bg-muted rounded loading-skeleton w-1/4"></div>
                  <div className="h-4 bg-muted rounded loading-skeleton w-1/5"></div>
                  <div className="h-4 bg-muted rounded loading-skeleton w-1/6"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'form':
        return (
          <div className={`space-y-6 ${className}`}>
            {Array.from({ length: count })?.map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-muted rounded loading-skeleton w-1/4"></div>
                <div className="h-10 bg-muted rounded-lg loading-skeleton w-full"></div>
              </div>
            ))}
            <div className="h-10 bg-muted rounded-lg loading-skeleton w-1/3"></div>
          </div>
        );

      case 'spinner':
        return (
          <div className={`flex items-center justify-center ${className}`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            {showText && (
              <span className="ml-3 text-sm text-muted-foreground">Loading...</span>
            )}
          </div>
        );

      default:
        return (
          <div className={`space-y-4 ${className}`}>
            <div className="h-8 bg-muted rounded loading-skeleton w-1/2"></div>
            <div className="h-4 bg-muted rounded loading-skeleton w-full"></div>
            <div className="h-4 bg-muted rounded loading-skeleton w-3/4"></div>
            <div className="h-4 bg-muted rounded loading-skeleton w-5/6"></div>
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default LoadingComponent;