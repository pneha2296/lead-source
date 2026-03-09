import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { FiBookOpen, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { BsPlay } from 'react-icons/bs';

const DocumentationModal = ({ isOpen, toggle, docs, sourceIcon }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!docs) return null;

  const { title, description, videoUrl, steps, features } = docs;
  const totalSteps = steps?.length || 0;

  const handlePrev = () => setActiveStep((s) => Math.max(0, s - 1));
  const handleNext = () => setActiveStep((s) => Math.min(totalSteps - 1, s + 1));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size='lg' scrollable>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2'>
          <FiBookOpen style={{ fontSize: '1.1rem' }} />
          <span>{title} — Setup Guide</span>
        </div>
      </ModalHeader>
      <ModalBody style={{ padding: 0 }}>
        {/* Header Section */}
        <div className='p-4' style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div className='d-flex align-items-start gap-3'>
            {sourceIcon && (
              <div
                style={{
                  fontSize: '1.8rem',
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0',
                }}
              >
                {sourceIcon}
              </div>
            )}
            <div className='flex-grow-1'>
              <p className='mb-0 text-muted' style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                {description}
              </p>
            </div>
          </div>

          {/* Video Tutorial */}
          {videoUrl && (
            <div className='mt-3'>
              <a
                href={videoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-sm d-inline-flex align-items-center gap-1'
                style={{
                  backgroundColor: '#FF0000',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                }}
              >
                <BsPlay size={16} />
                <span>Watch Video Tutorial</span>
              </a>
            </div>
          )}
        </div>

        {/* Step Navigation */}
        {totalSteps > 0 && (
          <>
            {/* Progress Bar */}
            <div className='px-4 pt-3'>
              <div className='d-flex align-items-center justify-content-between mb-2'>
                <span className='fw-medium' style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Step {activeStep + 1} of {totalSteps}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {Math.round(((activeStep + 1) / totalSteps) * 100)}% complete
                </span>
              </div>
              <div
                style={{
                  height: '4px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${((activeStep + 1) / totalSteps) * 100}%`,
                    backgroundColor: '#3b82f6',
                    borderRadius: '2px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Step Dots */}
            <div className='d-flex justify-content-center gap-2 px-4 pt-3'>
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className='btn p-0'
                  style={{
                    width: idx === activeStep ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: idx === activeStep ? '#3b82f6' : idx < activeStep ? '#93c5fd' : '#e2e8f0',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  title={`Step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Active Step Content */}
            <div className='p-4'>
              <div
                className='p-4 rounded'
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  minHeight: '200px',
                }}
              >
                {/* Step Number Badge */}
                <div className='d-flex align-items-center gap-2 mb-3'>
                  <span
                    className='d-flex align-items-center justify-content-center fw-bold'
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      fontSize: '0.8rem',
                      flexShrink: 0,
                    }}
                  >
                    {activeStep + 1}
                  </span>
                  <h6 className='mb-0 fw-bold' style={{ fontSize: '1rem', color: '#1e293b' }}>
                    {steps[activeStep].title}
                  </h6>
                </div>

                {/* Step Description */}
                <p className='mb-0 text-muted' style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                  {steps[activeStep].description}
                </p>

                {/* Step Image */}
                {steps[activeStep].image && (
                  <div className='mt-3'>
                    <img
                      src={steps[activeStep].image}
                      alt={steps[activeStep].title}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        backgroundColor: '#f8fafc',
                      }}
                    />
                  </div>
                )}

                {/* Step Tip */}
                {steps[activeStep].tip && (
                  <div
                    className='d-flex align-items-start gap-2 mt-3 p-3 rounded'
                    style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
                  >
                    <HiOutlineLightBulb style={{ color: '#d97706', fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.8rem', color: '#92400e' }}>
                      {steps[activeStep].tip}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className='d-flex justify-content-between mt-3'>
                <button
                  className='btn btn-sm btn-outline-secondary d-flex align-items-center gap-1'
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  style={{ fontSize: '0.8rem' }}
                >
                  <FiChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  className='btn btn-sm btn-primary d-flex align-items-center gap-1'
                  onClick={activeStep === totalSteps - 1 ? toggle : handleNext}
                  style={{ fontSize: '0.8rem' }}
                >
                  <span>{activeStep === totalSteps - 1 ? 'Done' : 'Next'}</span>
                  {activeStep < totalSteps - 1 && <FiChevronRight size={14} />}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Features Section */}
        {features && features.length > 0 && (
          <div className='px-4 pb-4'>
            <div
              className='p-3 rounded'
              style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#15803d' }}>
                Key Features
              </div>
              <div className='d-flex flex-wrap gap-2'>
                {features.map((feature, idx) => (
                  <span
                    key={idx}
                    className='d-flex align-items-center gap-1'
                    style={{ fontSize: '0.78rem', color: '#166534' }}
                  >
                    <FiCheckCircle size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                    <span>{feature}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

DocumentationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  docs: PropTypes.object,
  sourceIcon: PropTypes.node,
};

export default DocumentationModal;
