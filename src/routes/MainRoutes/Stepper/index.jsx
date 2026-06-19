import React from 'react';
import { useNavigate } from 'react-router-dom';

const Stepper = ({ steps, currentStep, onStepClick, className = '' }) => {
  const navigate = useNavigate();

  const handleStepClick = (index, step) => {
    // Only allow navigation to completed steps or current step
    if (index <= currentStep) {
      if (step.path) {
        navigate(step.path);
      }
      if (onStepClick) {
        onStepClick(index, step);
      }
    }
  };

  return (
    <div className={`w-full px-4 py-6 ${className}`}>
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isUpcoming = index > currentStep;
          const stepNumber = index + 1;

          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => handleStepClick(index, step)}
                  disabled={isUpcoming}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300
                    ${isCompleted ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer' : ''}
                    ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-200 hover:bg-blue-700' : ''}
                    ${isUpcoming ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}
                    ${!isUpcoming && !isCompleted && !isActive ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </button>
                <span className={`
                  mt-2 text-xs font-medium text-center
                  ${isActive ? 'text-blue-600' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${isUpcoming ? 'text-gray-400' : ''}
                `}>
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10px] text-gray-400 text-center hidden sm:block">
                    {step.description}
                  </span>
                )}
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative">
                  <div className="absolute inset-0 bg-gray-200"></div>
                  <div 
                    className={`
                      absolute inset-0 transition-all duration-500
                      ${isCompleted ? 'bg-green-500' : ''}
                      ${isActive ? 'bg-blue-500' : ''}
                      ${isUpcoming ? 'bg-gray-200' : ''}
                    `}
                    style={{
                      width: isCompleted ? '100%' : isActive ? '50%' : '0%'
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;