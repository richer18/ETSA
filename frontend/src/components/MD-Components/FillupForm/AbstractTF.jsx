import "bootstrap/dist/css/bootstrap.min.css";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import axiosInstance from "../../../api/axiosInstance";
// Static Field Definitions
const fieldOptions = [
  "BUILDING_PERMIT_FEE",
  "ELECTRICAL_FEE",
  "ZONING_FEE",
  "LIVESTOCK_DEV_FUND",
  "DIVING_FEE",
];
const cashier = ["Please a select", "FLORA MY", "IRIS", "RICARDO", "AGNES"];

const fieldConfigs = {
  BUILDING_PERMIT_FEE: {
    label: "Building Permit Fee",
    percentages: [
      { label: "Local Fund (80%)", value: (value) => (value * 0.8).toFixed(2) },
      {
        label: "Trust Fund (15%)",
        value: (value) => (value * 0.15).toFixed(2),
      },
      {
        label: "National Fund (5%)",
        value: (value) => (value * 0.05).toFixed(2),
      },
    ],
  },
  LIVESTOCK_DEV_FUND: {
    label: "Livestock Dev. Fund",
    percentages: [
      { label: "Local Fund (80%)", value: (value) => (value * 0.8).toFixed(2) },
      {
        label: "National Fund (20%)",
        value: (value) => (value * 0.2).toFixed(2),
      },
    ],
  },
  DIVING_FEE: {
    label: "Diving Fee",
    percentages: [
      { label: "GF (40%)", value: (value) => (value * 0.4).toFixed(2) },
      { label: "BRGY (30%)", value: (value) => (value * 0.3).toFixed(2) },
      { label: "Fishers (30%)", value: (value) => (value * 0.3).toFixed(2) },
    ],
  },
  ELECTRICAL_FEE: {
    label: "Electrical Fee",
    percentages: [],
  },
  ZONING_FEE: {
    label: "Zoning Fee",
    percentages: [],
  },
};


function AbstractTF({ data, mode, refreshData }) {
  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [showSelect, setShowSelect] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCashier, setSelectedCashier] = useState("");
  const [taxpayerName, setTaxpayerName] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [typeReceipt, setTypeReceipt] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [alertVariant, setAlertSeverity] = useState("info");

  const handleFieldChange = (field, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  useEffect(() => {
    const totalSum = Object.values(fieldValues).reduce(
      (acc, value) => acc + parseFloat(value || 0),
      0
    );
    setTotal(totalSum);
  }, [fieldValues]);

  const handleClearFields = useCallback(() => {
    setSelectedDate(null);
    setTaxpayerName("");
    setReceiptNumber("");
    setTypeReceipt("");
    setSelectedCashier("");
    setFieldValues({});
    setFields([]);
  }, []);

  const handleSave = useCallback(async () => {
    if (
      !selectedDate ||
      !taxpayerName ||
      !receiptNumber ||
      !typeReceipt ||
      !selectedCashier
    ) {
      setAlertMessage("Please fill out all required fields.");
      setAlertSeverity("error");
      return;
    }

    const payload = {
      DATE: selectedDate,
      NAME: taxpayerName,
      RECEIPT_NO: receiptNumber,
      CASHIER: selectedCashier,
      TYPE_OF_RECEIPT: typeReceipt,
      TOTAL: total,
      ...fieldValues,
    };

    setLoading(true);

    try {
      const url =
        mode === "edit" ? `update-trust-fund/${data.ID}` : `save-trust-fund`;

      const method = mode === "edit" ? "put" : "post";
   
      await axiosInstance({
        method,
        url,
        data: payload,
      });

      setAlertMessage(
        mode === "edit"
          ? "Data updated successfully."
          : "Data saved successfully."
      );
      setAlertSeverity("success");

      handleClearFields();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Axios error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const message =
        error.response?.status === 400
          ? "Receipt number already exists."
          : error.response?.data?.message || "Failed to save data.";

      setAlertMessage(message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  }, [
    selectedDate,
    taxpayerName,
    receiptNumber,
    typeReceipt,
    selectedCashier,
    total,
    fieldValues,
    mode,
    data,
    handleClearFields,
  ]);
  
  

  useEffect(() => {
    if (loading) {
      setProgress(0); // optional: reset progress bar at start
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return Math.min(prev + Math.random() * 10, 100);
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [loading]);

  const handleRemoveField = (fieldToRemove) => {
    const updatedFields = fields.filter((field) => field !== fieldToRemove);
    setFields(updatedFields);

    setFieldValues((prevValues) => {
      const updatedValues = { ...prevValues };
      delete updatedValues[fieldToRemove];
      return updatedValues;
    });
  };

  useEffect(() => {
    if (mode === "edit" && data) {
      setSelectedDate(data.DATE || null);
      setTaxpayerName(data.NAME || "");
      setReceiptNumber(data.RECEIPT_NO || "");
      setTypeReceipt(data.TYPE_OF_RECEIPT || "");
      setSelectedCashier(data.CASHIER || "");

      const newFields = [];
      const newFieldValues = {};

      fieldOptions.forEach((fieldKey) => {
        const fieldValue = Number(data[fieldKey]);
        if (!isNaN(fieldValue) && fieldValue > 0) {
          newFields.push(fieldKey);
          newFieldValues[fieldKey] = fieldValue.toString();
        }
      });

      setFields(newFields);
      setFieldValues(newFieldValues);
    }
  }, [data, mode]);

  return (
    <Container>
      <h4 className="mb-4 text-center">
        Trust Fund Abstracts ({mode === "edit" ? "Edit" : "Add"})
      </h4>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Row className="g-3 mb-4">
          <Col md={12}>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formTaxpayer">
              <Form.Label>Name of Taxpayer</Form.Label>
              <Form.Control
                type="text"
                value={taxpayerName}
                onChange={(e) => setTaxpayerName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formReceipt">
              <Form.Label>Receipt No. P.F. No. 25(A)</Form.Label>
              <Form.Control
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formReceiptType">
              <Form.Label>Type of Receipt</Form.Label>
              <Form.Control
                type="text"
                value={typeReceipt}
                onChange={(e) => setTypeReceipt(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formCashier">
              <Form.Label>Select Cashier</Form.Label>
              <Form.Select
                value={selectedCashier}
                onChange={(e) => setSelectedCashier(e.target.value)}
                required
              >
                {cashier.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {fields.map((field) => {
            const config = fieldConfigs[field];
            if (!config) return null;

            const rawValue = fieldValues[field];
            const numericValue = parseFloat(rawValue);

            return (
              <Col md={12} key={field}>
                <Form.Group controlId={`form-${field}`}>
                  <Form.Label>{config.label}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={rawValue}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-danger"
                      onClick={() => handleRemoveField(field)}
                    >
                      <FaTrash />
                    </Button>
                  </InputGroup>

                  {config.percentages.length > 0 && numericValue > 0 && (
                    <div className="mt-2 ms-2">
                      {config.percentages.map((p, idx) => (
                        <div
                          key={idx}
                          style={{ fontSize: "0.875rem", color: "#6c757d" }}
                        >
                          <strong>{p.label}:</strong> ₱{p.value(numericValue)}
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>
              </Col>
            );
          })}

          <Col md={12}>
            <Button
              variant="primary"
              onClick={() => setShowSelect(true)}
              className="mt-2"
            >
              Add New Field
            </Button>
          </Col>

          {showSelect && (
            <Col md={12}>
              <Form.Group controlId="formSelectField">
                <Form.Label>Select Field to Add</Form.Label>
                <Form.Select
                  value={selectedField}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected && !fields.includes(selected)) {
                      setFields([...fields, selected]);
                      setFieldValues({ ...fieldValues, [selected]: "" });
                    }
                    setSelectedField("");
                    setShowSelect(false);
                  }}
                >
                  <option value="">-- Select Field --</option>
                  {fieldOptions
                    .filter((option) => !fields.includes(option))
                    .map((option) => (
                      <option key={option} value={option}>
                        {fieldConfigs[option]?.label || option}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          )}

          <Col md={12}>
            <h5 className="mt-3">Total: ₱{total.toFixed(2)}</h5>
          </Col>
        </Row>

        {alertMessage && (
          <Alert variant={alertVariant} className="mt-3">
            {alertMessage}
          </Alert>
        )}

        {loading && (
          <ProgressBar
            now={progress}
            label={`${progress.toFixed(0)}%`}
            animated
            className="mt-3"
          />
        )}

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="secondary"
            onClick={handleClearFields}
            className="me-2"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            type="button" // ✅ prevent form submit
            onClick={handleSave} // ✅ only triggers save once
          >
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AbstractTF;
