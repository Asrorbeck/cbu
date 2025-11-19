import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const NewsCard = ({ article, className = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/news-articles-hub/article/${article?.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Policy': 'bg-primary/10 text-primary',
      'Banking': 'bg-secondary/10 text-secondary',
      'Economy': 'bg-success/10 text-success',
      'Regulation': 'bg-accent/10 text-accent',
      'Technology': 'bg-warning/10 text-warning'
    };
    return colors?.[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-card border border-border rounded-xl overflow-hidden cursor-pointer card-hover shadow-md hover:shadow-lg transition-all duration-300 ease-in-out ${className}`}
    >
      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article?.image}
          alt={article?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article?.category)}`}>
            {article?.category}
          </span>
        </div>
        {article?.featured && (
          <div className="absolute top-4 right-4">
            <div className="bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Icon name="Star" size={12} />
              <span>Featured</span>
            </div>
          </div>
        )}
      </div>
      {/* Article Content */}
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} />
            <span>{formatDate(article?.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>{article?.readTime} min read</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {article?.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {article?.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="User" size={14} />
            <span>{article?.author}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium">Read More</span>
            <Icon 
              name="ArrowRight" 
              size={16} 
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;