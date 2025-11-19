import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      id: 'emergency',
      title: 'Emergency Contact',
      description: 'Get immediate assistance',
      icon: 'Phone',
      action: () => window.open('tel:+998712345678'),
      variant: 'destructive'
    },
    {
      id: 'location',
      title: 'Find Branch',
      description: 'Locate nearest branch',
      icon: 'MapPin',
      action: () => window.open('https://maps.google.com'),
      variant: 'outline'
    },
    {
      id: 'support',
      title: 'Customer Support',
      description: 'Chat with our team',
      icon: 'MessageCircle',
      action: () => window.open('https://t.me/centralbankbot'),
      variant: 'secondary'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Fast access to essential services</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <div key={action?.id} className="group">
            <Button
              variant={action?.variant}
              onClick={action?.action}
              className="w-full h-auto p-4 flex flex-col items-center space-y-2 group-hover:scale-105 transition-transform duration-300"
            >
              <Icon name={action?.icon} size={24} />
              <div className="text-center">
                <div className="font-medium text-sm">{action?.title}</div>
                <div className="text-xs opacity-80">{action?.description}</div>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;