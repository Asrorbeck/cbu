import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const announcements = [
    {
      id: 1,
      type: 'info',
      title: 'New Digital Services Available',
      message: 'Experience our enhanced online banking platform with improved security features.',
      icon: 'Info',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  if (!isVisible || announcements?.length === 0) return null;

  const announcement = announcements?.[0];

  return (
    <div className={`${announcement?.bgColor} ${announcement?.borderColor} border rounded-xl p-4 mb-6 theme-transition`}>
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 ${announcement?.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon 
            name={announcement?.icon} 
            size={18} 
            className={announcement?.color}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${announcement?.color} mb-1`}>
            {announcement?.title}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {announcement?.message}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/50 flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <Icon name="X" size={16} className="text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;