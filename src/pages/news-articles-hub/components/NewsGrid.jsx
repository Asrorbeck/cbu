import React from 'react';
import NewsCard from './NewsCard';
import LoadingComponent from '../../../components/ui/LoadingComponent';

const NewsGrid = ({ articles, loading, hasMore, onLoadMore }) => {
  if (loading && articles?.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingComponent type="card" count={6} />
      </div>
    );
  }

  if (!articles || articles?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8"/>
            <path d="M15 18h-5"/>
            <path d="M10 6h8v4h-8V6Z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Articles Found</h3>
        <p className="text-muted-foreground">
          We couldn't find any articles matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map((article) => (
          <NewsCard key={article?.id} article={article} />
        ))}
      </div>
      {/* Load More Section */}
      {hasMore && (
        <div className="text-center py-8">
          {loading ? (
            <LoadingComponent type="spinner" showText={true} />
          ) : (
            <button
              onClick={onLoadMore}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300 flex items-center space-x-2 mx-auto"
            >
              <span>Load More Articles</span>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14"/>
                <path d="m19 12-7 7-7-7"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsGrid;