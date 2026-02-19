import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
// import DatePicker from 'react-bootstrap-date-picker';
import { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axiosInstance from "../../../../../api/axiosInstance";

/** Add months to a Date object (+3, +7, +11) for quarterly auto-fill. */
function addMonths(baseDate, monthsToAdd) {
  const d = new Date(baseDate.getTime());
  const currentDay = d.getDate();
  d.setMonth(d.getMonth() + monthsToAdd);
  if (d.getDate() < currentDay) {
    d.setDate(0);
  }
  return d;
}

/** Format a date to YYYY-MM-DD for <TextField type="date"> */
function formatDateYMD(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BusinessAdditional({
  data = {},
  updateData,
  handleNext,
  handleBack,
}) {
  // Basic states initialized from parent `data`
  const [businessActivity, setBusinessActivity] = useState(
    data?.businessActivity || "Main Office"
  );
  const [otherActivity, setOtherActivity] = useState(data?.otherActivity || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedKeywords, setAddedKeywords] = useState(data?.addedKeywords || []);
  const [productsServices, setProductsServices] = useState(
    data?.productsServices || ""
  );
  const [numUnits, setNumUnits] = useState(data?.numUnits || "");
  const [totalCap, setTotalCap] = useState(data?.totalCap || "");

  // Payment & Registration
  const [registrationType, setRegistrationType] = useState(
    data?.registrationType || "new"
  );
  const [paymentMode, setPaymentMode] = useState(data?.paymentMode || "annual");

  // Local/Fixed Taxes arrays
  const [localTaxes, setLocalTaxes] = useState(data?.localTaxes || []);
  const [fixedTaxes, setFixedTaxes] = useState(data?.fixedTaxes || []);

  // ANNUAL
  const [annualDate, setAnnualDate] = useState(data?.annualDate || "");
  const [annualORNo, setAnnualORNo] = useState(data?.annualORNo || "");
  const [annualPay, setAnnualPay] = useState(data?.annualPay || "");

  // BI-ANNUAL
  const [biFirstDate, setBiFirstDate] = useState(data?.biFirstDate || "");
  const [biFirstORNo, setBiFirstORNo] = useState(data?.biFirstORNo || "");
  const [biFirstPay, setBiFirstPay] = useState(data?.biFirstPay || "");

  const [biSecondDate, setBiSecondDate] = useState(data?.biSecondDate || "");
  const [biSecondORNo, setBiSecondORNo] = useState(data?.biSecondORNo || "");
  const [biSecondPay, setBiSecondPay] = useState(data?.biSecondPay || "");

  // QUARTERLY
  const [q1Date, setQ1Date] = useState(data?.q1Date || "");
  const [q1OR, setQ1OR] = useState(data?.q1OR || "");
  const [q1Pay, setQ1Pay] = useState(data?.q1Pay || "");

  const [q2Date, setQ2Date] = useState(data?.q2Date || "");
  const [q2OR, setQ2OR] = useState(data?.q2OR || "");
  const [q2Pay, setQ2Pay] = useState(data?.q2Pay || "");

  const [q3Date, setQ3Date] = useState(data?.q3Date || "");
  const [q3OR, setQ3OR] = useState(data?.q3OR || "");
  const [q3Pay, setQ3Pay] = useState(data?.q3Pay || "");

  const [q4Date, setQ4Date] = useState(data?.q4Date || "");
  const [q4OR, setQ4OR] = useState(data?.q4OR || "");
  const [q4Pay, setQ4Pay] = useState(data?.q4Pay || "");

  // Regulatory Fees
  const [regulatoryFees, setRegulatoryFees] = useState(
    data?.regulatoryFees || []
  );

  /** Safely parse a string to float */
  function toFloat(val) {
    return parseFloat(val) ? parseFloat(val) : 0;
  }

  const biannualPartialSum = useMemo(() => {
    // Only include the second payment in the sum
    return toFloat(biSecondPay);
  }, [biSecondPay]);

  /** getBiannualPartialSum: Biannual payments */

  // baseLocalTaxes: sum from the localTaxes array
  const baseLocalTaxes = localTaxes.reduce(
    (acc, curr) => acc + toFloat(curr.total),
    0
  );

  const onSubmit = (event) => {
    event.preventDefault();

    updateData({
      businessActivity,
      otherActivity,
      addedKeywords,
      productsServices,
      numUnits,
      totalCap,
      registrationType,
      paymentMode,
      localTaxes,
      fixedTaxes,
      regulatoryFees,
      annualDate,
      annualORNo,
      annualPay,
      biFirstDate,
      biFirstORNo,
      biFirstPay,
      biSecondDate,
      biSecondORNo,
      biSecondPay,
      q1Date,
      q1OR,
      q1Pay,
      q2Date,
      q2OR,
      q2Pay,
      q3Date,
      q3OR,
      q3Pay,
      q4Date,
      q4OR,
      q4Pay,
    });

    if (handleNext) handleNext();
  };

  const handleActivityChange = (event) => {
    setBusinessActivity(event.target.value);
  };

  // const handleDateChange = (date, setDateFn) => {
  //   setDateFn(date);
  // };

  /** Sum "total" in any array of {total: <string|number>} */
  function calculateTotal(list) {
    return list.reduce((sum, item) => sum + toFloat(item.total), 0).toFixed(2);
  }

  const quarterlyPartialSum = useMemo(() => {
    return toFloat(q2Pay) + toFloat(q3Pay) + toFloat(q4Pay);
  }, [q2Pay, q3Pay, q4Pay]);

  /** getQuarterlyPartialSum: Q2 + Q3 + Q4 only */
  function getQuarterlyPartialSum() {
    return toFloat(q2Pay) + toFloat(q3Pay) + toFloat(q4Pay);
  }

  // finalLocalTaxes: If "quarterly", add Q2+Q3+Q4
  const finalLocalTaxes =
    paymentMode === "quarterly"
      ? baseLocalTaxes + quarterlyPartialSum
      : paymentMode === "biannual"
        ? baseLocalTaxes + biannualPartialSum // This now includes only the second payment
        : baseLocalTaxes;

  // Auto-fill Q2, Q3, Q4 dates when Q1 changes (only in "quarterly" mode)
  useEffect(() => {
    if (paymentMode === "quarterly" && q1Date) {
      const d = new Date(q1Date);
      if (!isNaN(d.getTime())) {
        // Check if date is valid
        setQ2Date(formatDateYMD(addMonths(d, 3)));
        setQ3Date(formatDateYMD(addMonths(d, 6))); // Fixed typo (should be +6, not +7)
        setQ4Date(formatDateYMD(addMonths(d, 9))); // Fixed typo (should be +9, not +11)
      }
    }
  }, [paymentMode, q1Date]);

  // Auto-fill for biannual dates when Q1 changes (only in "biannual" mode)
  useEffect(() => {
    if (paymentMode === "biannual" && q1Date) {
      const d = new Date(q1Date);
      if (!isNaN(d.getTime())) {
        // Check if date is valid
        setBiFirstDate(formatDateYMD(addMonths(d, 6))); // Biannual starts 6 months after Q1
        setBiSecondDate(formatDateYMD(addMonths(d, 12))); // Second payment 12 months after Q1
      }
    }
  }, [paymentMode, q1Date]);

  // Generic field changes for localTaxes, fixedTaxes, etc.
  const handleFieldChange = (index, field, value, setFn, arrayData) => {
    const updated = [...arrayData];
    updated[index][field] = field === "total" ? parseFloat(value) || "" : value;
    setFn(updated);
  };

  const handleRemoveField = (index, setFn, arrayData) => {
    const updated = arrayData.filter((_, i) => i !== index);
    setFn(updated);
  };

  // Add row for local/fixed/reg fees
  const handleAddLocalTax = () =>
    setLocalTaxes([...localTaxes, { name: "", total: "" }]);
  const handleAddFixedTax = () =>
    setFixedTaxes([...fixedTaxes, { name: "", total: "" }]);
  const handleAddRegulatoryFee = () =>
    setRegulatoryFees([
      ...regulatoryFees,
      { name: "", total: "", isDefault: false },
    ]);

  // Remove row from reg fees if not default
  const handleRemoveRegulatoryFee = (index) => {
    setRegulatoryFees((prev) => prev.filter((_, i) => i !== index));
  };

  // Example: Searching logic for line of business (unchanged)
  // 🔍 Fetch PSIC data when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      axiosInstance
        .get("datapsic")
        .then((res) => {
          const data = res.data;
          const results = [];

          data.forEach((section) => {
            section.Divisions.forEach((division) => {
              division.Groups.forEach((group) => {
                group.Classes.forEach((classData) => {
                  classData.Subclasses.forEach((subclass) => {
                    if (
                      subclass.subclass_description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      const cleanDescription = subclass.subclass_description
                        .split("This class includes")[0]
                        .trim();
                      results.push({
                        fullDescription: subclass.subclass_description,
                        description: cleanDescription,
                        subclass_code: subclass.subclass_code,
                      });
                    }
                  });
                });
              });
            });
          });

          // ✅ Remove duplicates
          const unique = [...new Set(results.map(JSON.stringify))].map(
            JSON.parse
          );
          setSearchResults(unique);
        })
        .catch((err) => console.error("Error fetching data:", err));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Input change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Add keyword
  const handleAddKeyword = (keyword) => {
    const exists = addedKeywords.find(
      (k) =>
        k.description === keyword.description &&
        k.subclass_code === keyword.subclass_code
    );
    if (!exists) {
      setAddedKeywords((prev) => [...prev, keyword]);
    }
  };

  // Remove keyword
  const handleRemoveKeyword = (keyword) => {
    setAddedKeywords((prev) =>
      prev.filter(
        (k) =>
          !(
            k.description === keyword.description &&
            k.subclass_code === keyword.subclass_code
          )
      )
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        backgroundImage:
          'url("https://ucarecdn.com/4594b137-724c-4041-a614-43a973a69812/")',
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
        minHeight: "650px",
        padding: "2rem",
      }}
    >
      <Row className="g-3 mb-4">
        <Col>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
          >
            Business Activity
          </Typography>
          <Typography variant="body2" sx={{ color: "red", mb: 1 }}>
            (Please check one) Required
          </Typography>
        </Col>
      </Row>

      {/* MAIN FORM */}
      <form onSubmit={onSubmit}>
        <Row className="g-3 mb-4">
          <Col>
            <FormControl>
              <FormLabel>Select Activity</FormLabel>
              <RadioGroup
                row
                name="businessActivity"
                value={businessActivity}
                onChange={handleActivityChange}
              >
                <FormControlLabel
                  value="Main Office"
                  control={<Radio />}
                  label="Main Office"
                />
                <FormControlLabel
                  value="Branch Office"
                  control={<Radio />}
                  label="Branch Office"
                />
                <FormControlLabel
                  value="Admin Office Only"
                  control={<Radio />}
                  label="Admin Office Only"
                />
                <FormControlLabel
                  value="Warehouse"
                  control={<Radio />}
                  label="Warehouse"
                />
                <FormControlLabel
                  value="Others"
                  control={<Radio />}
                  label="Others"
                />
              </RadioGroup>
            </FormControl>
          </Col>

          {/* SPECIFY OTHERS */}
          {businessActivity === "Others" && (
            <Col>
              <TextField
                fullWidth
                label="Specify Others"
                variant="outlined"
                value={otherActivity}
                onChange={(e) => setOtherActivity(e.target.value)}
              />
            </Col>
          )}
        </Row>

        {/* SEARCH LINE OF BUSINESS */}
        <Row className="g-3 mb-4">
          <Col>
            <Typography variant="h6">Line of Business</Typography>
            <TextField
              fullWidth
              label="Search Field"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1">Search Results:</Typography>
                {searchResults.map((resItem, idx) => (
                  <Box key={idx} display="flex" alignItems="center" my={1}>
                    <Typography sx={{ flex: 1 }}>
                      {resItem.fullDescription} - {resItem.subclass_code}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddKeyword(resItem)}
                    >
                      Add
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Col>

          {/* ADDED KEYWORDS */}
          {addedKeywords.length > 0 && (
            <Col>
              <Typography variant="subtitle1">Added Keywords:</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Line of Business</TableCell>
                      <TableCell>PSIC Code</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {addedKeywords.map((kw, index) => (
                      <TableRow key={index}>
                        <TableCell>{kw.description}</TableCell>
                        <TableCell>{kw.subclass_code}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveKeyword(kw)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
          )}
        </Row>

        {/* PRODUCTS, UNITS, TOTAL CAP, GROSS SALES */}
        <Row className="g-3 mb-4">
          <Col>
            <TextField
              fullWidth
              label="Products / Services"
              variant="outlined"
              value={productsServices}
              onChange={(e) => setProductsServices(e.target.value)}
            />
          </Col>

          <Col>
            <TextField
              fullWidth
              label="No. of Units"
              variant="outlined"
              value={numUnits}
              onChange={(e) => setNumUnits(e.target.value)}
            />
          </Col>

          <Col>
            <TextField
              fullWidth
              label="Total Capitalization (PH) For New"
              variant="outlined"
              value={totalCap}
              onChange={(e) => setTotalCap(e.target.value)}
            />
          </Col>

          <Col>
            <TextField
              fullWidth
              label="Last Year's Gross Sales/Receipts"
              variant="outlined"
              value={totalCap}
              onChange={(e) => setTotalCap(e.target.value)}
            />
          </Col>
        </Row>

        {/* ASSESSMENTS */}
        <Row className="g-3 mb-4">
          <Col>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
            >
              Assessments
            </Typography>
          </Col>
        </Row>

        {/* LOCAL TAXES TABLE */}
        <Row className="g-3 mb-4">
          <Col>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                Local Taxes
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#115293" },
                }}
                onClick={handleAddLocalTax}
              >
                ADD LOCAL TAX
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localTaxes.map((tax, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={tax.name}
                          onChange={(e) =>
                            handleFieldChange(
                              i,
                              "name",
                              e.target.value,
                              setLocalTaxes,
                              localTaxes
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={tax.total}
                          onChange={(e) =>
                            handleFieldChange(
                              i,
                              "total",
                              e.target.value,
                              setLocalTaxes,
                              localTaxes
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveField(i, setLocalTaxes, localTaxes)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* TOTAL ROW (includes partial payments if QUARTERLY) */}
                  <TableRow>
                    <TableCell
                      sx={{ textAlign: "right", fontWeight: "bold" }}
                      colSpan={1}
                    >
                      TOTAL
                    </TableCell>
                    <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                      {finalLocalTaxes.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Col>
        </Row>

        {/* FIXED TAXES TABLE */}
        <Row className="g-3 mb-4">
          <Col>
            <Box
              sx={{ mt: 4, mb: 1 }}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                Fixed Taxes
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#115293" },
                }}
                onClick={handleAddFixedTax}
              >
                ADD FIXED TAX
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fixedTaxes.map((tax, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={tax.name}
                          onChange={(e) =>
                            handleFieldChange(
                              i,
                              "name",
                              e.target.value,
                              setFixedTaxes,
                              fixedTaxes
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={tax.total}
                          onChange={(e) =>
                            handleFieldChange(
                              i,
                              "total",
                              e.target.value,
                              setFixedTaxes,
                              fixedTaxes
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveField(i, setFixedTaxes, fixedTaxes)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* TOTAL row */}
                  <TableRow>
                    <TableCell
                      sx={{ textAlign: "right", fontWeight: "bold" }}
                      colSpan={1}
                    >
                      TOTAL
                    </TableCell>
                    <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                      {calculateTotal(fixedTaxes)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Col>
        </Row>

        {/* REGULATORY FEES TABLE */}
        <Row className="g-3 mb-4">
          <Col>
            <Box
              sx={{ mt: 4, mb: 1 }}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                Regulatory Fees & Charges
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#115293" },
                }}
                onClick={handleAddRegulatoryFee}
              >
                ADD
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fee Name</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regulatoryFees.map((fee, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {fee.isDefault ? (
                          <Typography>{fee.name}</Typography>
                        ) : (
                          <TextField
                            fullWidth
                            size="small"
                            value={fee.name}
                            onChange={(e) =>
                              handleFieldChange(
                                idx,
                                "name",
                                e.target.value,
                                setRegulatoryFees,
                                regulatoryFees
                              )
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          value={fee.total}
                          onChange={(e) =>
                            handleFieldChange(
                              idx,
                              "total",
                              e.target.value,
                              setRegulatoryFees,
                              regulatoryFees
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        {!fee.isDefault && (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveRegulatoryFee(idx)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* TOTAL Row */}
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={2}
                      sx={{ fontWeight: "bold" }}
                    >
                      TOTAL
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {calculateTotal(regulatoryFees)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Col>
        </Row>

        {/* TYPE / MODE CARDS */}
        <Row className="g-3 mb-4">
          <Col>
            <Box sx={{ mt: 3 }} display="flex" justifyContent="center" gap={3}>
              {/* TYPE OF REGISTRATION */}
              <Paper
                elevation={2}
                sx={{
                  px: 3,
                  py: 2,
                  minWidth: "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <FormControl>
                  <FormLabel
                    sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
                  >
                    TYPE OF REGISTRATION
                  </FormLabel>
                  <RadioGroup
                    name="registrationType"
                    value={registrationType}
                    onChange={(e) => setRegistrationType(e.target.value)}
                  >
                    <FormControlLabel
                      value="new"
                      control={<Radio />}
                      label="NEW"
                    />
                    <FormControlLabel
                      value="additional"
                      control={<Radio />}
                      label="ADDITIONAL"
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>

              {/* MODE OF PAYMENTS */}
              <Paper
                elevation={2}
                sx={{
                  px: 3,
                  py: 2,
                  minWidth: "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <FormControl>
                  <FormLabel
                    sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
                  >
                    MODE OF PAYMENTS
                  </FormLabel>
                  <RadioGroup
                    name="paymentMode"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <FormControlLabel
                      value="annual"
                      control={<Radio />}
                      label="ANNUAL"
                    />
                    <FormControlLabel
                      value="biannual"
                      control={<Radio />}
                      label="BI-ANNUAL"
                    />
                    <FormControlLabel
                      value="quarterly"
                      control={<Radio />}
                      label="QUARTERLY"
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Box>
          </Col>
        </Row>

        {/* ANNUAL / BI-ANNUAL / QUARTERLY FIELDS */}
        <Row className="g-3 mb-4">
          <Col>
            {/* Annual Fields */}
            {paymentMode === "annual" && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  ANNUAL PAYMENT
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={annualDate}
                  onChange={(e) => setAnnualDate(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="OR No."
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={annualORNo}
                  onChange={(e) => setAnnualORNo(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Pay"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 2 }}
                  value={annualPay}
                  onChange={(e) => setAnnualPay(e.target.value)}
                />
              </Box>
            )}

            {/* Bi-Annual Fields */}
            {paymentMode === "biannual" && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  1ST PAYMENT
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={biFirstDate}
                  onChange={(e) => setBiFirstDate(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="OR No."
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={biFirstORNo}
                  onChange={(e) => setBiFirstORNo(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Pay"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 3 }}
                  value={biFirstPay}
                  onChange={(e) => setBiFirstPay(e.target.value)}
                />

                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  2ND PAYMENT
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={biSecondDate}
                  onChange={(e) => setBiSecondDate(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="OR No."
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={biSecondORNo}
                  onChange={(e) => setBiSecondORNo(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Pay"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 2 }}
                  value={biSecondPay}
                  onChange={(e) => setBiSecondPay(e.target.value)}
                />
              </Box>
            )}

            {/* Quarterly Fields */}
            {paymentMode === "quarterly" && (
              <Box sx={{ mt: 2 }}>
                {/* 1ST Payment (excluded) */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  1ST PAYMENT (excluded from Local Taxes)
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q1Date}
                  onChange={(e) => setQ1Date(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="OR No."
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q1OR}
                  onChange={(e) => setQ1OR(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="1st Payment"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 3 }}
                  value={q1Pay}
                  onChange={(e) => setQ1Pay(e.target.value)}
                />

                {/* 2ND Payment (included) */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  2ND PAYMENT (included in Local Taxes)
                </Typography>

                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q2Date}
                  onChange={(e) => setQ2Date(e.target.value)}
                />

                <TextField
                  fullWidth
                  label="OR No."
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q2OR}
                  onChange={(e) => setQ2OR(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="2nd Payment"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 3 }}
                  value={q2Pay}
                  onChange={(e) => setQ2Pay(e.target.value)}
                />

                {/* 3RD Payment (included) */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  3RD PAYMENT (included in Local Taxes)
                </Typography>

                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q3Date}
                  onChange={(e) => setQ3Date(e.target.value)}
                />

                <TextField
                  fullWidth
                  label="OR No."
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q3OR}
                  onChange={(e) => setQ3OR(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="3rd Payment"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 3 }}
                  value={q3Pay}
                  onChange={(e) => setQ3Pay(e.target.value)}
                />

                {/* 4TH Payment (included) */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  4TH PAYMENT (included in Local Taxes)
                </Typography>

                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q4Date}
                  onChange={(e) => setQ4Date(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="OR No."
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={q4OR}
                  onChange={(e) => setQ4OR(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="4th Payment"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 2 }}
                  value={q4Pay}
                  onChange={(e) => setQ4Pay(e.target.value)}
                />

                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, fontWeight: "bold" }}
                >
                  SUBTOTAL: {getQuarterlyPartialSum().toFixed(2)}
                </Typography>
              </Box>
            )}
          </Col>
        </Row>

        {/* ACTION BUTTONS */}
        <Row className="g-3 mb-4">
          <Col>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleBack}
            >
              Previous
            </Button>
          </Col>

          <Col>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Next
            </Button>
          </Col>
        </Row>
      </form>
    </Box>
  );
}
