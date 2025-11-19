import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';


const FeaturedNews = ({ featuredArticles }) => {
  const navigate = useNavigate();

  if (!featuredArticles || featuredArticles?.length === 0) {
    return null;
  }

  const mainArticle = featuredArticles?.[0];
  const sideArticles = featuredArticles?.slice(1, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleArticleClick = (articleId) => {
    navigate(`/news-articles-hub/article/${articleId}`);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Star" size={20} className="text-warning" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Featured News</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Article */}
        <div className="lg:col-span-2">
          <div
            onClick={() => handleArticleClick(mainArticle?.id)}
            className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer card-hover shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            <div className="relative h-64 lg:h-80 overflow-hidden">
              <Image
                src={mainArticle?.image}
                alt={mainArticle?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Icon name="Star" size={14} />
                  <span>Featured</span>
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-4 text-white/80 text-sm mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{formatDate(mainArticle?.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{mainArticle?.readTime} min read</span>
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2">
                  {mainArticle?.title}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2 mb-4">
                  {mainArticle?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Side Featured Articles */}
        <div className="space-y-6">
          {sideArticles?.map((article) => (
            <div
              key={article?.id}
              onClick={() => handleArticleClick(article?.id)}
              className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer card-hover shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <div className="flex">
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                  <Image
                    src={article?.image}
                    alt={article?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                    <Icon name="Calendar" size={12} />
                    <span>{formatDate(article?.publishedAt)}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {article?.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                    <Icon name="Clock" size={12} />
                    <span>{article?.readTime} min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;