import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

const ApplicationModal = ({ isOpen, onClose, onSubmit, vacancy }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes?.includes(file?.type)) {
        setErrors(prev => ({
          ...prev,
          resume: 'Please upload a PDF or Word document'
        }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file?.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          resume: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resume: file
      }));
      setErrors(prev => ({
        ...prev,
        resume: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.coverLetter?.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData?.coverLetter?.trim()?.length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    }

    if (!formData?.resume) {
      newErrors.resume = 'Resume is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationData = {
        ...formData,
        vacancyId: vacancy?.id,
        appliedAt: new Date()?.toISOString()
      };
      
      onSubmit(applicationData);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        resume: null
      });
      setErrors({});
    } catch (error) {
      console.error('Application submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Apply for Position"
      size="lg"
      closeOnOverlayClick={!isSubmitting}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Job Info */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-popover-foreground mb-1">
            {vacancy?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {vacancy?.department} • {vacancy?.location}
          </p>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-popover-foreground">
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData?.fullName}
              onChange={handleInputChange}
              error={errors?.fullName}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData?.email}
              onChange={handleInputChange}
              error={errors?.email}
              required
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData?.phone}
            onChange={handleInputChange}
            error={errors?.phone}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Cover Letter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-popover-foreground">
            Cover Letter <span className="text-destructive">*</span>
          </label>
          <textarea
            name="coverLetter"
            rows={6}
            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
            value={formData?.coverLetter}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-popover-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors?.coverLetter && (
            <p className="text-sm text-destructive">{errors?.coverLetter}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData?.coverLetter?.length}/500 characters (minimum 50)
          </p>
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-popover-foreground">
            Resume/CV <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors duration-200 ${
              formData?.resume ? 'bg-success/5 border-success' : 'bg-muted/50'
            }`}>
              <Icon 
                name={formData?.resume ? "CheckCircle" : "Upload"} 
                size={32} 
                className={`mx-auto mb-2 ${formData?.resume ? 'text-success' : 'text-muted-foreground'}`}
              />
              <p className="text-sm font-medium text-popover-foreground">
                {formData?.resume ? formData?.resume?.name : 'Click to upload resume'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, DOCX up to 5MB
              </p>
            </div>
          </div>
          {errors?.resume && (
            <p className="text-sm text-destructive">{errors?.resume}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplicationModal;