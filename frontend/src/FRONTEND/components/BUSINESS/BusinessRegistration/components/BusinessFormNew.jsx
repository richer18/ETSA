import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Controller, useForm, useWatch } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as yup from "yup";

const typesRequiringRegistrationNo = [
  "Cooperative",
  "Corporation",
  "One Person Corporation",
  "Partnership",
  "Sole Proprietorship",
];

function BusinessForm({ data, updateData, handleNext }) {
  const businessTypesWithGender = [
    "One Person Corporation",
    "Sole Proprietorship",
  ];
  const schema = yup.object().shape({
    businessType: yup.string().required("Business Type is required"),

    registrationNo: yup.string().test(
      "is-required-based-on-businessType",
      "Registration No. is required",
      // Use `function` for Yup context
      function (value) {
        /* eslint-disable-next-line react/no-this-in-sfc */
        const { businessType } = this.parent;
        if (typesRequiringRegistrationNo.includes(businessType)) {
          return !!value;
        }
        return true;
      }
    ),

    businessName: yup.string().required("Business Name is required"),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),

    emailAddress: yup
      .string()
      .email("Invalid email")
      .required("E-Mail Address is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: data,
  });

  const businessType = useWatch({
    control,
    name: "businessType",
  });

  const onSubmit = (formValues) => {
    updateData(formValues); // <-- Save into parent
    handleNext(); // <-- Move to next step
  };

  const isOwnerGenderApplicable =
    businessTypesWithGender.includes(businessType);

  React.useEffect(() => {
    if (!isOwnerGenderApplicable) {
      setValue("ownerGender", "");
    }
  }, [isOwnerGenderApplicable, setValue]);

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        backgroundImage:
          'url("https://ucarecdn.com/4594b137-724c-4041-a614-43a973a69812/")',
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
        minHeight: "650px",
        padding: "2rem",
      }}
    >
      <Box maxWidth="lg" mx="auto">
        {/* Form Header */}
        <Typography
          variant="h5"
          align="left" // Align to the left
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            marginBottom: "1rem", // Adjust spacing
          }}
        >
          Business Information and Registration
        </Typography>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3 mb-4">
            <Col>
              <FormControl fullWidth error={!!errors.businessType}>
                <InputLabel id="business-type-label">Business Type</InputLabel>
                <Controller
                  name="businessType"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="business-type-label"
                      label="Business Type"
                    >
                      <MenuItem value="">
                        <em>Select Business Type</em>
                      </MenuItem>
                      <MenuItem value="Cooperative">Cooperative</MenuItem>
                      <MenuItem value="Corporation">Corporation</MenuItem>
                      <MenuItem value="One Person Corporation">
                        One Person Corporation
                      </MenuItem>
                      <MenuItem value="Partnership">Partnership</MenuItem>
                      <MenuItem value="Sole Proprietorship">
                        Sole Proprietorship
                      </MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.businessType?.message}</FormHelperText>
              </FormControl>
            </Col>

            <Col>
              <FormControl fullWidth>
                <InputLabel id="owner-gender-label">Owner's Gender</InputLabel>
                <Controller
                  name="ownerGender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="owner-gender-label"
                      label="Owner's Gender"
                      disabled={!isOwnerGenderApplicable} // <-- DISABLE here directly!
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col>
              <Controller
                name="registrationNo"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  let label = "";
                  switch (businessType) {
                    case "Cooperative":
                      label = "CDA Registration No.";
                      break;
                    case "Corporation":
                    case "One Person Corporation":
                    case "Partnership":
                      label = "SEC Registration No.";
                      break;
                    case "Sole Proprietorship":
                      label = "DTI Registration No.";
                      break;
                    default:
                      label = "Registration No.";
                  }
                  return (
                    <TextField
                      {...field}
                      label={label}
                      placeholder="Enter Registration No."
                      variant="outlined"
                      fullWidth
                      error={!!errors.registrationNo}
                      helperText={
                        errors.registrationNo
                          ? errors.registrationNo.message
                          : ""
                      }
                    />
                  );
                }}
              />
            </Col>

            <Col>
              <Controller
                name="businessName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Business Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.businessName}
                    helperText={
                      errors.businessName ? errors.businessName.message : ""
                    }
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ marginTop: "2rem", fontWeight: "bold", color: "#050505" }}
              >
                Owner's Name
              </Typography>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.firstName}
                    helperText={
                      errors.firstName ? errors.firstName.message : ""
                    }
                  />
                )}
              />
            </Col>

            <Col>
              <Controller
                name="middleName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Middle Name (Optional)"
                    variant="outlined"
                    fullWidth
                    error={!!errors.middleName}
                    helperText={
                      errors.middleName ? errors.middleName.message : ""
                    }
                  />
                )}
              />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ""}
                  />
                )}
              />
            </Col>

            <Col>
              <FormControl fullWidth>
                <InputLabel id="suffix-name-label">Extension Name</InputLabel>
                <Controller
                  name="suffixName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="suffix-name-label"
                      label="Extension Name"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Jr.">Jr.</MenuItem>
                      <MenuItem value="Sr.">Sr.</MenuItem>
                      <MenuItem value="III">III</MenuItem>
                      <MenuItem value="IV">IV</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Col>
          </Row>

          <Row>
            <Col>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  marginTop: "2rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#050505",
                }}
              >
                Contact Information
              </Typography>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col>
              <Controller
                name="emailAddress"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="E-Mail Address"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.emailAddress}
                    helperText={
                      errors.emailAddress ? errors.emailAddress.message : ""
                    }
                  />
                )}
              />
            </Col>

            <Col>
              <Controller
                name="cellphoneNo"
                control={control}
                defaultValue="+63"
                render={({ field }) => (
                  <Box sx={{ width: "100%", position: "relative" }}>
                    <PhoneInput
                      country="ph"
                      onlyCountries={["ph"]}
                      masks={{ ph: "... ... ...." }}
                      countryCodeEditable={false}
                      containerStyle={{ width: "100%", borderRadius: "4px" }}
                      inputStyle={{
                        width: "100%",
                        height: "56px",
                        fontSize: "16px",
                        paddingLeft: "48px",
                        borderRadius: "4px",
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                        backgroundColor: "transparent",
                        color: "#333",
                        outline: "none",
                      }}
                      buttonStyle={{
                        border: "none",
                        background: "transparent",
                        position: "absolute",
                        top: "50%",
                        left: "8px",
                        transform: "translateY(-50%)",
                      }}
                      dropdownStyle={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                      // FIX: Proper binding to react-hook-form
                      value={field.value}
                      onChange={(phone) => field.onChange(phone)}
                    />
                    {errors.cellphoneNo && (
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.cellphoneNo.message}
                      </FormHelperText>
                    )}
                  </Box>
                )}
              />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#323232",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#505050",
                  },
                  height: "56px", // Match TextField height
                  fontSize: "16px",
                }}
              >
                Next
              </Button>
            </Col>

            <Col>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                sx={{
                  height: "56px", // Match TextField height
                  fontSize: "16px",
                }}
                onClick={() => {
                  // Handle cancel action here
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Box>
    </Box>
  );
}

BusinessForm.propTypes = {
  handleNext: PropTypes.func.isRequired,
};

export default BusinessForm;
