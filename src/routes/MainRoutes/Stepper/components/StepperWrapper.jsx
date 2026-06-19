import React from 'react';
import Stepper from '../index';

const StepperWrapper = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  children,
  title,
  subtitle,
  className = '' 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
          </div>
        )}

        {/* Stepper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <Stepper 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={onStepClick}
          />
        </div>

        {/* Content */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default StepperWrapper;