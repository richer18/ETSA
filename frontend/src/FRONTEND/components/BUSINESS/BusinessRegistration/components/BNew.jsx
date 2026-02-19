import { Box, Step, StepLabel, Stepper } from "@mui/material";
import React from "react";
import BusinessAdditional from "./BusinessAdditional";
import BusinessAddress from "./BusinessAdress";
import BusinessForm from "./BusinessFormNew";
import BusinessOperation from "./BusinessOperation";
import BusinessReview from "./ReviewDataNew";

const steps = [
  "Business Information and Registration",
  "Business Address",
  "Business Operation",
  "Additional Details",
  "Review & Submit",
];

function BNew() {
  const [activeStep, setActiveStep] = React.useState(0);

  // Parent state holds ALL data
  const [formData, setFormData] = React.useState({
    businessInfo: {},
    businessAddress: {},
    businessOperation: {},
    businessAdditional: {},
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const goToStep = (stepIndex) => setActiveStep(stepIndex);

  // Merge updates into parent
  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BusinessForm
            data={formData.businessInfo}
            updateData={(data) => updateFormData("businessInfo", data)}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <BusinessAddress
            data={formData.businessAddress}
            updateData={(data) => updateFormData("businessAddress", data)}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 2:
        return (
          <BusinessOperation
            data={formData.businessOperation}
            updateData={(data) => updateFormData("businessOperation", data)}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 3:
        return (
          <BusinessAdditional
            data={formData.businessAdditional}
            updateData={(data) => updateFormData("businessAdditional", data)}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 4:
        return (
          <BusinessReview
            formData={formData}
            handleBack={handleBack}
            goToStep={goToStep} // pass jump-to-step function
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {/* <Stepper nonLinear activeStep={activeStep} sx={{ width: "80%" }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel color="inherit" onClick={() => goToStep(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper> */}
        <Stepper activeStep={activeStep} sx={{ width: "80%" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {renderStepContent()}
    </Box>
  );
}

export default BNew;
