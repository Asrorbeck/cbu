import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ApplicationModal from './ApplicationModal';

const JobDetailModal = ({ isOpen, onClose, vacancy }) => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  if (!vacancy) return null;

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(vacancy?.deadline);
  const isUrgent = daysRemaining <= 7;
  const canApply = daysRemaining > 0;

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (applicationData) => {
    console.log('Application submitted:', applicationData);
    setShowApplicationModal(false);
    onClose();
    // Show success message or redirect
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        className="max-h-[90vh]"
        title={vacancy?.title || 'Job Details'}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-popover-foreground mb-2">
                  {vacancy?.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Building" size={16} />
                    <span>{vacancy?.department}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={16} />
                    <span>{vacancy?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={16} />
                    <span>{vacancy?.type}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUrgent 
                  ? 'bg-destructive/10 text-destructive' :'bg-success/10 text-success'
              }`}>
                {canApply ? `${daysRemaining} days left` : 'Deadline passed'}
              </div>
            </div>

            {/* Salary */}
            {vacancy?.salary && (
              <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg">
                <Icon name="DollarSign" size={20} className="text-primary" />
                <span className="text-lg font-semibold text-primary">
                  {vacancy?.salary}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-popover-foreground">Job Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {vacancy?.fullDescription || vacancy?.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-popover-foreground">Requirements</h2>
            <ul className="space-y-2">
              {vacancy?.requirements?.map((req, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          {vacancy?.responsibilities && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-popover-foreground">Responsibilities</h2>
              <ul className="space-y-2">
                {vacancy?.responsibilities?.map((resp, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {vacancy?.benefits && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-popover-foreground">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vacancy?.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-success/5 rounded-lg">
                    <Icon name="Gift" size={16} className="text-success" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Deadline */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-popover-foreground">Application Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDeadline(vacancy?.deadline)}
                  </p>
                </div>
              </div>
              {canApply && (
                <Button
                  variant="default"
                  onClick={handleApply}
                  iconName="Send"
                  iconPosition="left"
                  className="px-6"
                >
                  Apply Now
                </Button>
              )}
            </div>
            {!canApply && (
              <div className="mt-3 p-3 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  Application deadline has passed
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
        vacancy={vacancy}
      />
    </>
  );
};

export default JobDetailModal;