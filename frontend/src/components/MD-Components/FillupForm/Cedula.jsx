import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const cashierOptions = ["flora", "angelique", "ricardo", "agnes"];
const basicCommunityTax = 5.0;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const stepCircleSx = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0080A7",
  color: "#fff",
  fontWeight: 700,
  mr: 1.5,
};

const roundedFieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
};

function Cedula({ data, mode, onSaved, onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [originalReceipt, setOriginalReceipt] = useState("");
  const [savingInProgress, setSavingInProgress] = useState(false);

  const [formData, setFormData] = useState({
    receipt: "",
    localTin: "",
    fullName: "",
    ctcYear: dayjs().year(),
    businessGrossReceipts: "",
    salariesProfessionEarnings: "",
    realPropertyIncome: "",
    interest: "",
    userid: "",
  });

  useEffect(() => {
    if (!data) return;

    const mappedReceipt = String(data?.["CTC NO"] ?? data?.CTCNO ?? "");
    const mappedDate = data?.DATE ?? data?.DATEISSUED ?? "";
    const mappedYear = Number(
      data?.CTCYEAR ?? (mappedDate ? dayjs(mappedDate).year() : dayjs().year())
    );

    setOriginalReceipt(mappedReceipt);
    setSelectedDate(mappedDate ? dayjs(mappedDate).format("YYYY-MM-DD") : "");
    setFormData({
      receipt: mappedReceipt,
      localTin: String(data?.LOCAL ?? data?.LOCAL_TIN ?? ""),
      fullName: String(data?.NAME ?? data?.OWNERNAME ?? ""),
      ctcYear: Number.isFinite(mappedYear) ? mappedYear : dayjs().year(),
      businessGrossReceipts: String(data?.BUSTAXDUE ?? data?.TAX_DUE ?? ""),
      salariesProfessionEarnings: String(data?.SALTAXDUE ?? 0),
      realPropertyIncome: String(data?.RPTAXDUE ?? 0),
      interest: String(data?.INTEREST ?? ""),
      userid: String(data?.CASHIER ?? data?.USERID ?? ""),
    });
  }, [data]);

  const totals = useMemo(() => {
    const business = toNumber(formData.businessGrossReceipts);
    const salaries = toNumber(formData.salariesProfessionEarnings);
    const realProperty = toNumber(formData.realPropertyIncome);
    const interest = toNumber(formData.interest);
    const total = basicCommunityTax + business + salaries + realProperty + interest;
    return { business, salaries, realProperty, interest, total };
  }, [
    formData.businessGrossReceipts,
    formData.salariesProfessionEarnings,
    formData.realPropertyIncome,
    formData.interest,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      receipt: "",
      localTin: "",
      fullName: "",
      ctcYear: dayjs().year(),
      businessGrossReceipts: "",
      salariesProfessionEarnings: "",
      realPropertyIncome: "",
      interest: "",
      userid: "",
    });
    setSelectedDate("");
  };

  const handleSave = async () => {
    if (!formData.receipt || !selectedDate || savingInProgress) return;

    setSavingInProgress(true);
    const now = new Date();
    const formatDateTime = (date) => date.toISOString().slice(0, 19).replace("T", " ");

    const payload = {
      DATEISSUED: selectedDate,
      TRANSDATE: formatDateTime(now),
      CTCNO: formData.receipt,
      CTCTYPE: "CTCI",
      OWNERNAME: formData.fullName,
      LOCAL_TIN: formData.localTin,
      BASICTAXDUE: basicCommunityTax,
      BUSTAXDUE: totals.business,
      SALTAXDUE: totals.salaries,
      RPTAXDUE: totals.realProperty,
      INTEREST: totals.interest,
      TOTALAMOUNTPAID: totals.total,
      USERID: formData.userid,
      CTCYEAR: toNumber(formData.ctcYear) || dayjs().year(),
      DATALASTEDITED: formatDateTime(now),
    };

    const isEditMode = mode === "edit";
    const updateKey = originalReceipt || formData.receipt;
    const url = isEditMode
      ? `updateCedulaData/${encodeURIComponent(updateKey)}`
      : "saveCedulaData";

    try {
      await axiosInstance[isEditMode ? "put" : "post"](url, payload);
      alert(isEditMode ? "Data updated successfully" : "Data saved successfully");
      if (typeof onSaved === "function") await onSaved();
      if (typeof onClose === "function") onClose();
      if (!isEditMode) handleReset();
    } catch (error) {
      console.error("Error during save:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setSavingInProgress(false);
    }
  };

  const calculateTotal = () => totals.total.toFixed(2);

  return (
    <Box sx={{ maxWidth: 1220, mx: "auto", p: { xs: 1, md: 2 } }}>
      <Row className="g-3">
        <Col xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: "16px",
              border: "1px solid #d8e2ee",
              backgroundColor: "#f8fbff",
              mb: 2,
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Box sx={stepCircleSx}>1</Box>
              <Typography variant="h6" fontWeight={700} color="#16324f">
                Cedula Information
              </Typography>
            </Box>
            <Row className="g-2">
              <Col xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date Issued"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  sx={roundedFieldSx}
                />
              </Col>
              <Col xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CTC No."
                  name="receipt"
                  value={formData.receipt}
                  onChange={handleChange}
                  variant="outlined"
                  sx={roundedFieldSx}
                />
              </Col>
              <Col xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Local TIN"
                  name="localTin"
                  value={formData.localTin}
                  onChange={handleChange}
                  variant="outlined"
                  sx={roundedFieldSx}
                />
              </Col>
              <Col xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="tax-year-label">CTC Year</InputLabel>
                  <Select
                    labelId="tax-year-label"
                    label="CTC Year"
                    name="ctcYear"
                    value={formData.ctcYear}
                    onChange={handleChange}
                    sx={{ borderRadius: "12px" }}
                  >
                    {[2024, 2025, 2026, 2027, 2028].map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Col>
              <Col xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  variant="outlined"
                  sx={roundedFieldSx}
                />
              </Col>
            </Row>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: "16px",
              border: "1px solid #d8e2ee",
              backgroundColor: "#ffffff",
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Box sx={stepCircleSx}>2</Box>
              <Typography variant="h6" fontWeight={700} color="#16324f">
                Tax Breakdown
              </Typography>
            </Box>

            <Row className="g-2 align-items-center">
              <Col xs={12} md={8}>
                <Typography sx={{ color: "#2b3c54", fontWeight: 600 }}>
                  Basic Community Tax
                </Typography>
              </Col>
              <Col xs={12} md={4}>
                <TextField
                  fullWidth
                  value={basicCommunityTax.toFixed(2)}
                  InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">PHP</InputAdornment> }}
                  sx={roundedFieldSx}
                />
              </Col>

              <Col xs={12} md={8}>
                <Typography sx={{ color: "#2b3c54", fontWeight: 600 }}>
                  Business Gross Receipts
                </Typography>
              </Col>
              <Col xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="businessGrossReceipts"
                  value={formData.businessGrossReceipts}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">PHP</InputAdornment> }}
                  sx={roundedFieldSx}
                />
              </Col>

              <Col xs={12} md={8}>
                <Typography sx={{ color: "#2b3c54", fontWeight: 600 }}>
                  Salaries / Profession Earnings
                </Typography>
              </Col>
              <Col xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="salariesProfessionEarnings"
                  value={formData.salariesProfessionEarnings}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">PHP</InputAdornment> }}
                  sx={roundedFieldSx}
                />
              </Col>

              <Col xs={12} md={8}>
                <Typography sx={{ color: "#2b3c54", fontWeight: 600 }}>
                  Real Property Income
                </Typography>
              </Col>
              <Col xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="realPropertyIncome"
                  value={formData.realPropertyIncome}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">PHP</InputAdornment> }}
                  sx={roundedFieldSx}
                />
              </Col>

              <Col xs={12} md={8}>
                <Typography sx={{ color: "#2b3c54", fontWeight: 600 }}>
                  Interest
                </Typography>
              </Col>
              <Col xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">PHP</InputAdornment> }}
                  sx={roundedFieldSx}
                />
              </Col>

              <Col xs={12}>
                <Divider sx={{ my: 1 }} />
              </Col>

              <Col xs={12} md={8}>
                <Typography sx={{ color: "#0c2e4d", fontWeight: 800 }}>
                  Total Amount Paid
                </Typography>
              </Col>
              <Col xs={12} md={4}>
                <TextField
                  fullWidth
                  value={calculateTotal()}
                  InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">PHP</InputAdornment> }}
                  sx={roundedFieldSx}
                />
              </Col>

              <Col xs={12} md={8}>
                <Typography sx={{ color: "#2b3c54", fontWeight: 600 }}>
                  Cashier
                </Typography>
              </Col>
              <Col xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="cashier-label">Select Cashier</InputLabel>
                  <Select
                    labelId="cashier-label"
                    name="userid"
                    label="Select Cashier"
                    value={formData.userid}
                    onChange={handleChange}
                    sx={{ borderRadius: "12px" }}
                  >
                    <MenuItem value="">
                      <em>Assign Later</em>
                    </MenuItem>
                    {cashierOptions.map((cashier) => (
                      <MenuItem key={cashier} value={cashier}>
                        {cashier.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Col>
            </Row>

            <Row className="g-2 mt-2">
              <Col xs={12} sm={6}>
                <Button fullWidth variant="outlined" onClick={handleReset}>
                  RESET
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSave}
                  disabled={savingInProgress}
                  sx={{ fontWeight: 700 }}
                >
                  {savingInProgress ? "SAVING..." : "SAVE"}
                </Button>
              </Col>
            </Row>
          </Paper>
        </Col>

        <Col xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              border: "1px solid #d8e2ee",
              background: "linear-gradient(160deg, #f5f9ff 0%, #edf5ff 100%)",
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 1.6, color: "#50647c" }}>
              Quick Summary
            </Typography>
            <Typography variant="h5" fontWeight={800} color="#0d2e4f" sx={{ mb: 0.5 }}>
              PHP {calculateTotal()}
            </Typography>
            <Typography variant="body2" color="#5b7088" sx={{ mb: 2 }}>
              Current total assessment
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Row className="g-2">
              <Col xs={7}>
                <Typography variant="body2" color="#4c6078">Basic</Typography>
              </Col>
              <Col xs={5}>
                <Typography variant="body2" textAlign="right" fontWeight={600}>
                  PHP {basicCommunityTax.toFixed(2)}
                </Typography>
              </Col>

              <Col xs={7}>
                <Typography variant="body2" color="#4c6078">Business</Typography>
              </Col>
              <Col xs={5}>
                <Typography variant="body2" textAlign="right" fontWeight={600}>
                  PHP {totals.business.toFixed(2)}
                </Typography>
              </Col>

              <Col xs={7}>
                <Typography variant="body2" color="#4c6078">Salaries</Typography>
              </Col>
              <Col xs={5}>
                <Typography variant="body2" textAlign="right" fontWeight={600}>
                  PHP {totals.salaries.toFixed(2)}
                </Typography>
              </Col>

              <Col xs={7}>
                <Typography variant="body2" color="#4c6078">Real Property</Typography>
              </Col>
              <Col xs={5}>
                <Typography variant="body2" textAlign="right" fontWeight={600}>
                  PHP {totals.realProperty.toFixed(2)}
                </Typography>
              </Col>

              <Col xs={7}>
                <Typography variant="body2" color="#4c6078">Interest</Typography>
              </Col>
              <Col xs={5}>
                <Typography variant="body2" textAlign="right" fontWeight={600}>
                  PHP {totals.interest.toFixed(2)}
                </Typography>
              </Col>
            </Row>

            <Button
              fullWidth
              variant="text"
              onClick={onClose}
              sx={{ mt: 2, textTransform: "none" }}
            >
              Close Form
            </Button>
          </Paper>
        </Col>
      </Row>
    </Box>
  );
}

Cedula.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CTCNO: PropTypes.string,
    OWNERNAME: PropTypes.string,
    LOCAL_TIN: PropTypes.string,
    CTCYEAR: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    BUSTAXDUE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    SALTAXDUE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    RPTAXDUE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    INTEREST: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    TOTALAMOUNTPAID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    USERID: PropTypes.string,
  }),
  mode: PropTypes.string,
  onSaved: PropTypes.func,
  onClose: PropTypes.func,
};

export default Cedula;
