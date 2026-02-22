import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  ProgressBar,
  Row,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaCashRegister,
  FaFileInvoice,
  FaIdCard,
  FaListAlt,
  FaPlus,
  FaSave,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import axiosInstance from "../../../api/axiosInstance";

const fieldOptions = [
  "Manufacturing",
  "Distributor",
  "Retailing",
  "Financial",
  "Other_Business_Tax",
  "Sand_Gravel",
  "Fines_Penalties",
  "Mayors_Permit",
  "Weighs_Measure",
  "Tricycle_Operators",
  "Occupation_Tax",
  "Cert_of_Ownership",
  "Cert_of_Transfer",
  "Cockpit_Prov_Share",
  "Cockpit_Local_Share",
  "Sultadas",
  "Miscellaneous_Fee",
  "Reg_of_Birth",
  "Marriage_Fees",
  "Burial_Fees",
  "Correction_of_Entry",
  "Fishing_Permit_Fee",
  "Sale_of_Agri_Prod",
  "Sale_of_Acct_Form",
  "Water_Fees",
  "Stall_Fees",
  "Cash_Tickets",
  "Slaughter_House_Fee",
  "Rental_of_Equipment",
  "Doc_Stamp",
  "Police_Report_Clearance",
  "Secretaries_Fee",
  "Med_Dent_Lab_Fees",
  "Garbage_Fees",
  "Docking_Mooring_Fee",
  "Cutting_Tree",
];

const cashier = [
  "Please select",
  "FLORA MY",
  "IRIS",
  "RICARDO",
  "AGNES",
  "AMABELLA",
];

const filterOptions = (options, inputValue) => {
  if (!inputValue) return options;
  return options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase())
)};

const uiColors = {
  navy: "#0f2747",
  navyHover: "#0b1e38",
  amber: "#d6a12b",
  amberSoft: "rgba(214, 161, 43, 0.12)",
  border: "#d8e2ee",
  bg: "#f7f9fc",
  card: "#ffffff",
  textMuted: "#5b7088",
};

const labelStyle = { fontWeight: 600, color: uiColors.navy };
const inputStyle = {
  borderRadius: "10px",
  borderColor: uiColors.border,
  boxShadow: "none",
};

function AbstractGF({ data, mode }) {
  // State variables
  const [selectedDate, setSelectedDate] = useState("");
  const [taxpayerName, setTaxpayerName] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [typeReceipt, setTypeReceipt] = useState("");
  const [selectedCashier, setSelectedCashier] = useState("");
  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [selectedField, setSelectedField] = useState("");
  const [showSelect, setShowSelect] = useState(true);
  const [total, setTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-generate receipt number
  const autoGenerateReceipt = async () => {
    try {
      const lastReceipt = "000000";
      const newReceiptNum = String(parseInt(lastReceipt, 10) + 1).padStart(
        6,
        "0"
      );
      setReceiptNumber(newReceiptNum);
    } catch (error) {
      console.error("Error generating receipt:", error);
    }
  };

  // Prefill data in edit mode
  useEffect(() => {
    if (mode === "edit" && data) {
      setSelectedDate(data.date || null);
      setTaxpayerName(data.name || "");
      setReceiptNumber(data.receipt_no || "");
      setTypeReceipt(data.type_receipt || "");
      setSelectedCashier(data.cashier || "");

      const newFields = [];
      const newFieldValues = {};

      fieldOptions.forEach((fieldKey) => {
        const rawValue = data[fieldKey];

        // 🔑 Cast to number and filter out exact 0, including "0", "0.00", etc.
        const numericValue = parseFloat(rawValue);

        if (!isNaN(numericValue) && numericValue !== 0) {
          newFields.push(fieldKey);
          newFieldValues[fieldKey] = rawValue.toString();
        }
      });

      setFields(newFields);
      setFieldValues(newFieldValues);
      setShowSelect(false);
    } else if (mode === "add") {
      setSelectedDate(null);
      setTaxpayerName("");
      setReceiptNumber("");
      setTypeReceipt("");
      setSelectedCashier("");
      setFields([]);
      setFieldValues({});
      setShowSelect(true);
    }
  }, [data, mode]);

  // Calculate total
  useEffect(() => {
    const totalSum = Object.values(fieldValues).reduce(
      (acc, value) => acc + parseFloat(value || 0),
      0
    );
    setTotal(totalSum);
  }, [fieldValues]);

  // Field handlers
  const handleFieldChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveField = (removedField) => {
    const updatedFields = fields.filter((f) => f !== removedField);
    setFields(updatedFields);

    setFieldValues((prev) => {
      const updatedValues = { ...prev };
      delete updatedValues[removedField];
      return updatedValues;
    });
  };

  const handleFieldSelect = (event) => {
    const newSelectedField = event.target.value;

    if (newSelectedField && !fields.includes(newSelectedField)) {
      setFields([...fields, newSelectedField]);
      setFieldValues({ ...fieldValues, [newSelectedField]: "" });
      setSelectedField("");
      setShowSelect(false);

      if (newSelectedField === "Cash_Tickets") {
        autoGenerateReceipt();
      }
    }
  };

  // Reset form
  const handleClearFields = useCallback(() => {
    setSelectedDate("");
    setTaxpayerName("");
    setReceiptNumber("");
    setTypeReceipt("");
    setSelectedCashier("");
    setFieldValues({});
    setFields([]);
  }, []);

  // Save/update data
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      // 🔍 Validation
      if (
        !selectedDate ||
        !taxpayerName ||
        !receiptNumber ||
        !typeReceipt ||
        !selectedCashier
      ) {
        setAlertMessage("Please fill out all required fields.");
        setAlertVariant("danger");
        return;
      }

      for (const [field, value] of Object.entries(fieldValues)) {
        if (!value) {
          setAlertMessage(`Please fill out the field: ${field}.`);
          setAlertVariant("danger");
          return;
        }
      }

      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

      const payload = {
        date: formattedDate,
        name: taxpayerName,
        receipt_no: receiptNumber,
        ...fieldValues,
        total: total,
        cashier: selectedCashier,
        type_receipt: typeReceipt,
      };

      try {
        setLoading(true);

        if (mode === "edit" && data?.id) {
          // ✅ UPDATE
          await axiosInstance.put(`updateGeneralFundData/${data.id}`, payload);
          setAlertMessage("Data updated successfully.");
        } else {
          // ✅ ADD
          await axiosInstance.post("saveGeneralFundData", payload);
          setAlertMessage("Data saved successfully.");
        }

        setAlertVariant("success");

        setTimeout(() => {
          handleClearFields();
          setLoading(false);
          window.location.reload(); // Optional: refresh UI
        }, 2000);
      } catch (error) {
        console.error("❌ Operation failed:", error);
        const message =
          error.response?.data?.message ||
          `Failed to ${mode === "edit" ? "update" : "save"} data.`;
        setAlertMessage(message);
        setAlertVariant("danger");
        setLoading(false);
      }
    },
    [
      mode,
      data,
      selectedDate,
      taxpayerName,
      receiptNumber,
      typeReceipt,
      selectedCashier,
      fieldValues,
      total,
      handleClearFields,
    ]
  );

  // Progress animation
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prev) => {
          const diff = Math.random() * 10;
          return Math.min(prev + diff, 100);
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const filteredOptions = filterOptions(fieldOptions);

  return (
    <div
      style={{
        background: "transparent",
        padding: 0,
        boxShadow: "none",
      }}
    >
      <h4 className="mb-4 text-center" style={{ color: uiColors.navy, fontWeight: 800 }}>
        General Fund Abstracts ({mode === "edit" ? "Edit" : "Add"})
      </h4>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Row className="g-3 mb-4">
          <Col md={12}>
            <Form.Group controlId="formDate">
              <Form.Label style={labelStyle}>
                <FaCalendarAlt style={{ marginRight: 8 }} />
                Date
              </Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formTaxpayer">
              <Form.Label style={labelStyle}>
                <FaUser style={{ marginRight: 8 }} />
                Name of Taxpayer
              </Form.Label>
              <Form.Control
                type="text"
                value={taxpayerName}
                onChange={(e) => setTaxpayerName(e.target.value)}
                required
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formReceipt">
              <Form.Label style={labelStyle}>
                <FaFileInvoice style={{ marginRight: 8 }} />
                Receipt No. P.F. No. 25(A)
              </Form.Label>
              <Form.Control
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                required
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formReceiptType">
              <Form.Label style={labelStyle}>
                <FaIdCard style={{ marginRight: 8 }} />
                Type of Receipt
              </Form.Label>
              <Form.Control
                type="text"
                value={typeReceipt}
                onChange={(e) => setTypeReceipt(e.target.value)}
                required
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formCashier">
              <Form.Label style={labelStyle}>
                <FaUsers style={{ marginRight: 8 }} />
                Select Cashier
              </Form.Label>
              <Form.Select
                value={selectedCashier}
                onChange={(e) => setSelectedCashier(e.target.value)}
                required
                style={inputStyle}
              >
                {cashier.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Dynamic Fields */}
          {fields.map((field) => (
            <Col md={12} key={field}>
              <Form.Group controlId={`form-${field}`}>
                <Form.Label style={labelStyle}>
                  <FaListAlt style={{ marginRight: 8 }} />
                  {field}
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={fieldValues[field] || ""}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    required
                    style={inputStyle}
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemoveField(field)}
                  >
                    <FaTrash />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          ))}

          {showSelect && (
            <Col md={12}>
              <Form.Group controlId="formFieldSelect">
                <Form.Label style={labelStyle}>
                  <FaListAlt style={{ marginRight: 8 }} />
                  Select Field
                </Form.Label>
                <Form.Select
                  value={selectedField}
                  onChange={handleFieldSelect}
                  required
                  style={inputStyle}
                >
                  <option value="">Select a field</option>
                  {filteredOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          )}

          <Col md={12}>
            <Button
              variant="primary"
              onClick={() => setShowSelect(true)}
              className="mt-2"
              style={{
                backgroundColor: uiColors.navy,
                borderColor: uiColors.navy,
                fontWeight: 700,
                textTransform: "none"
              }}
            >
              <FaPlus style={{ marginRight: 8 }} />
              Add New Field
            </Button>
          </Col>

          <Col md={12}>
            <h5 className="mt-3" style={{ color: uiColors.navy, fontWeight: 700 }}>
              <FaCashRegister style={{ marginRight: 8 }} />
              Total: PHP {total.toFixed(2)}
            </h5>
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

        <div className="d-flex w-100 mt-4 gap-2">
          <Button
            variant="secondary"
            onClick={handleClearFields}
            className="flex-fill"
            style={{
              borderColor: uiColors.amber,
              color: uiColors.navy,
              backgroundColor: "rgba(214, 161, 43, 0.08)",
              fontWeight: 700,
              textTransform: "none",
              padding: "10px 18px",
              borderRadius: "10px",
            }}
          >
            <FaTrash style={{ marginRight: 8 }} />
            Reset
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleSave}
            className="flex-fill"
            style={{
              backgroundColor: uiColors.navy,
              borderColor: uiColors.navy,
              fontWeight: 700,
              textTransform: "none",
              padding: "10px 22px",
              borderRadius: "10px",
              boxShadow: "0 6px 14px rgba(15, 39, 71, 0.25)",
            }}
          >
            <FaSave style={{ marginRight: 8 }} />
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

AbstractGF.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    name: PropTypes.string,
    receipt_no: PropTypes.string,
    type_receipt: PropTypes.string,
    cashier: PropTypes.string,
    // Include other known dynamic fields if needed
  }),
  mode: PropTypes.oneOf(["edit", "add"]).isRequired,
};

export default AbstractGF;

