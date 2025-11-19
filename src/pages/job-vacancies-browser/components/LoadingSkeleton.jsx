import React from 'react';

const LoadingSkeleton = ({ type = 'cards', count = 6 }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
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
        ))}
      </div>
    );
  }

  if (type === 'vacancies') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: count })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded loading-skeleton w-3/4"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-muted rounded loading-skeleton w-20"></div>
                    <div className="h-4 bg-muted rounded loading-skeleton w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted rounded-full loading-skeleton w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded loading-skeleton w-full"></div>
                <div className="h-4 bg-muted rounded loading-skeleton w-5/6"></div>
                <div className="h-4 bg-muted rounded loading-skeleton w-4/6"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded loading-skeleton w-1/3"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-muted rounded loading-skeleton w-16"></div>
                  <div className="h-6 bg-muted rounded loading-skeleton w-20"></div>
                  <div className="h-6 bg-muted rounded loading-skeleton w-14"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="h-4 bg-muted rounded loading-skeleton w-24"></div>
                <div className="h-4 bg-muted rounded loading-skeleton w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;