import React from 'react';
import Icon from '../../../components/AppIcon';

const Breadcrumb = ({ currentStep, selectedBranchType, selectedDepartment, selectedVacancy, onNavigate }) => {
  const steps = [
    { id: 'departments', label: selectedDepartment?.name || 'Departments', step: 2 },
    { id: 'vacancies', label: selectedVacancy?.title || 'Vacancies', step: 3 },
    { id: 'details', label: selectedVacancy?.title || 'Job Details', step: 4 }
  ];

  const handleStepClick = (step) => {
    if (step < currentStep) {
      onNavigate(step);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {steps?.map((step, index) => (
        <React.Fragment key={step?.id}>
          <button
            onClick={() => handleStepClick(step?.step)}
            disabled={step?.step >= currentStep}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors duration-200 ${
              step?.step === currentStep
                ? 'text-primary font-medium bg-primary/10'
                : step?.step < currentStep
                ? 'text-muted-foreground hover:text-primary cursor-pointer'
                : 'text-muted-foreground cursor-not-allowed opacity-50'
            }`}
          >
            <span className="truncate max-w-[150px]">{step?.label}</span>
          </button>
          
          {index < steps?.length - 1 && (
            <Icon 
              name="ChevronRight" 
              size={16} 
              className="text-muted-foreground flex-shrink-0"
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;