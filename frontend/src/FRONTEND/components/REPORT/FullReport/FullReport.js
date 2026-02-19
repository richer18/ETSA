import { Edit, Save } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Collapse,
  Fade,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import GenerateReport from "./GenerateReport";

// Add this near the top of your component, with other constants
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function FullReport() {
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2025");
  const [data, setData] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [updatedDueFrom, setUpdatedDueFrom] = useState({});
  const [comments, setComments] = useState({});
  const [showButtons, setShowButtons] = useState(false); // Track button visibility

  // editingField was unused (setter never called). Use `editableRow` to control
  // row-level editing instead of an unused per-cell state to avoid linter warnings.
  // If you prefer per-cell editing in future, implement setEditingField on cell events.
  const [editingField] = useState(null);
  const [inputValues, setInputValues] = useState({}); // Temporary input values

  const [reportDialog, setReportDialog] = useState({
    open: false,
    status: "idle", // 'idle' | 'loading' | 'success' | 'error'
    progress: 0,
  });

  // Track which row (by date) is currently being saved to disable its save button
  const [savingRow, setSavingRow] = useState(null);

  // Then inside your component:
  const theme = useTheme();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogField, setDialogField] = useState("");
  const [dialogInputValue, setDialogInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(true); // Track if adding or subtracting

  const [selectedDate, setSelectedDate] = useState(null);

  const parseDate = (dateString) => {
    if (!dateString) return null;

    // Handle both formats coming from UI and database
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      // MM-DD-YYYY format
      const [month, day, year] = dateString.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Already in YYYY-MM-DD format
    return dateString;
  };

  // Reusable data fetcher so we can refresh UI without reloading the page
  const fetchData = useCallback(async (signal) => {
    try {
      const response = await axiosInstance.get("fetch-report", {
        signal,
      });
      setData(response.data);
    } catch (error) {
      if (axiosInstance.isCancel?.(error) || error.name === "CanceledError") {
        console.log("Fetch aborted"); // Request cancelled
      } else {
        console.error("Error fetching data:", error);
        setData([]);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const filteredData = React.useMemo(
    () =>
      data.filter((item) => {
        const itemDate = new Date(item.date);
        const selectedYear = parseInt(year, 10);
        const selectedMonth = parseInt(month, 10) - 1;
        return (
          (!month || itemDate.getMonth() === selectedMonth) &&
          (!year || itemDate.getFullYear() === selectedYear)
        );
      }),
    [data, month, year]
  );

  const handleEditClick = useCallback(
    (rowIndex) => {
      const selectedRow = filteredData[rowIndex];

      if (!selectedRow) {
        console.error(`❌ Row index ${rowIndex} is out of bounds.`);
        return;
      }

      setEditableRow(rowIndex);
      // store updatedDueFrom as an object keyed by the row date so multiple rows can be edited
      setUpdatedDueFrom((prev) => ({
        ...prev,
        [selectedRow.date]: selectedRow.dueFrom ?? 0,
      }));
      setShowButtons(true);
    },
    [filteredData]
  );

  useEffect(() => {
    const initialComments = {};
    // key comments by a stable identifier (date) instead of the ephemeral array index
    filteredData.forEach((row) => {
      if (row?.date) initialComments[row.date] = row.comment || "";
    });
    setComments(initialComments);
  }, [filteredData]);

  const handleSaveClick = async (rowIndex) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const row = filteredData[rowIndex];
    if (!row) return;

    const formattedDate = parseDate(row.date);

    // gather current values from `data` (which is the source of truth) -- find by date
    const sourceRow = data.find((d) => d?.date === row.date) || row;

    const payload = {
      date: formattedDate,
      // send numeric fields (ensure numbers)
      ctc: Number(sourceRow.ctc || 0),
      rpt: Number(sourceRow.rpt || 0),
      gfAndTf: Number(sourceRow.gfAndTf || 0),
      // dueFrom may have been edited and is stored keyed by date
      dueFrom:
        typeof updatedDueFrom[row.date] === "number"
          ? updatedDueFrom[row.date]
          : Number(sourceRow.dueFrom || 0),
      comment: comments[row.date] || "",
      // include adjustments if present
      adjustments: sourceRow.adjustments || {},
    };

    console.log("📤 Sending Update:", payload);

    setSavingRow(row.date);

    try {
      const response = await axiosInstance.post("update-report", payload, {
        signal,
      });

      console.log("✅ Update Successful:", response.data.message || response.data);

      // close edit mode for the row
      setShowButtons(false);
      setEditableRow(null);

      // Refresh data in-place so the UI reflects persisted changes without a full reload
      try {
        await fetchData();
      } catch (e) {
        console.warn('Failed to refresh data after save', e);
      }
    } catch (error) {
      if (error.name === "CanceledError") {
        console.warn("⚠️ Request Aborted");
      } else {
        console.error("❌ Error Updating:", error.response?.data || error.message);
        // optionally surface UI feedback here (snackbar)
      }
    } finally {
      setSavingRow(null);
      controller.abort();
    }
  };

  const handleCommentChange = (key, value) => {
    setComments((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const totalRcd = filteredData.reduce(
    (sum, item) => sum + Number(item.rcdTotal || 0),
    0
  );
  const totalDueFrom = filteredData.reduce(
    (sum, item) => sum + Number(item.dueFrom || 0),
    0
  );
  const totalCollections = totalRcd - totalDueFrom;

  // Open dialog for input
  // const openDialog = (rowIndex, field, isIncrement) => {
  //   setDialogRowIndex(rowIndex);
  //   setDialogField(field);
  //   setDialogInputValue(''); // Start with an empty input
  //   setIsAdding(isIncrement); // Set mode (adding or subtracting)
  //   setDialogOpen(true);
  // };

  const handleUnderClick = (index, field) => {
    setDialogField(field);
    setIsAdding(true); // "Under" means adding
    setSelectedDate(filteredData[index].date); // Store selected row's date

    let currentValue = 0;
    switch (field) {
      case "ctc":
        currentValue = filteredData[index]?.adjustments?.ctc?.under || 0;
        break;
      case "rpt":
        currentValue = filteredData[index]?.adjustments?.rpt?.under || 0;
        break;
      case "gfAndTf":
        currentValue = filteredData[index]?.adjustments?.gfAndTf?.under || 0;
        break;
      default:
        console.error("❌ Invalid field:", field);
        return;
    }

    setDialogInputValue(currentValue); // Set initial value in input field
    setDialogOpen(true);
  };

  // Opens the dialog with the proper field and adjustment type (isAdding=false means "Over")
  const handleOverClick = (index, field) => {
    setDialogField(field);
    setIsAdding(false); // "Over" means subtracting
    setSelectedDate(filteredData[index].date);

    let currentValue = 0;
    switch (field) {
      case "ctc":
        currentValue = filteredData[index]?.adjustments?.ctc?.over || 0;
        break;
      case "rpt":
        currentValue = filteredData[index]?.adjustments?.rpt?.over || 0;
        break;
      case "gfAndTf":
        currentValue = filteredData[index]?.adjustments?.gfAndTf?.over || 0;
        break;
      default:
        console.error("❌ Invalid field:", field);
        return;
    }

    setDialogInputValue(currentValue); // Set initial value in input field
    setDialogOpen(true);
  };

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      console.error("❌ Invalid date input:", dateString);
      return null;
    }

    // ✅ If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const parts = dateString.split(" ");
    if (parts.length !== 3) {
      console.error("❌ Invalid date format received:", dateString);
      return null;
    }

    const month = months[parts[0]];
    const day = parts[1].replace(",", "").padStart(2, "0"); // Remove comma and pad day
    const year = parts[2];

    if (!month || !day || !year) {
      console.error("❌ Failed to parse date:", dateString);
      return null;
    }

    return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
  };

  // Confirm and apply changes from dialog
  const handleDialogConfirm = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const adjustedValue = parseFloat(dialogInputValue);
    if (isNaN(adjustedValue)) {
      console.warn("⚠️ Invalid input, skipping update");
      return;
    }

    let columnToUpdate = "";
    switch (dialogField) {
      case "ctc":
        columnToUpdate = isAdding ? "CTCunder" : "CTCover";
        break;
      case "rpt":
        columnToUpdate = isAdding ? "RPTunder" : "RPTover";
        break;
      case "gfAndTf":
        columnToUpdate = isAdding ? "GFTFunder" : "GFTFover";
        break;
      default:
        console.error("❌ Invalid field:", dialogField);
        return;
    }

    // ✅ Fix Date Conversion
    const formattedDate = formatDateToYYYYMMDD(selectedDate);
    if (!formattedDate) {
      console.error("❌ Date conversion failed. Invalid date:", selectedDate);
      alert("Invalid date format. Please select a valid date.");
      return;
    }

    const payload = {
      date: formattedDate,
      column: columnToUpdate,
      value: adjustedValue,
    };

    console.log("🚀 Sending payload:", payload);

    try {
      const response = await axiosInstance.post("save-adjustment", payload, {
        signal, // ✅ AbortController supported in Axios v1+
      });

      console.log("✅ Adjustment saved successfully!", response.data);
      alert("Adjustment saved successfully!");
    } catch (error) {
      if (error.name === "CanceledError") {
        console.warn("⚠️ Request Aborted");
      } else {
        console.error(
          "❌ Failed to save adjustment:",
          error.response?.data || error.message
        );
        alert("Failed to save adjustment.");
      }
    } finally {
      controller.abort();
    }

    setDialogOpen(false);
    setDialogInputValue("");
  };
  // Handle manual input change in table fields
  // Accept a stable row key (date) instead of an index from the filtered array.
  const handleInputChange = (rowDate, field, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      // Allow only numbers and decimal points
      setInputValues((prev) => ({ ...prev, [`${rowDate}-${field}`]: value }));
      setData((prevData) =>
        prevData.map((item) =>
          item?.date === rowDate
            ? { ...item, [field]: parseFloat(value) || 0 }
            : item
        )
      );
    }
  };

  const handleGenerateReport = () => {
    // Open dialog in loading state
    setReportDialog({
      open: true,
      status: "loading",
      progress: 0,
    });

    // Simulate report generation
    const interval = setInterval(() => {
      setReportDialog((prev) => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, status: "success", progress: 100 };
        }
        return { ...prev, progress: newProgress };
      });
    }, 300);
  };

  const handleCloseDialog = () => {
    setReportDialog({ ...reportDialog, open: false });
  };

  const handleExportCSV = () => {
    if (!filteredData.length) return;

    const headers = [
      "Date",
      "CTC",
      "RPT",
      "GF and TF",
      "Due From",
      "RCD Total",
      "Remarks",
    ];

    const rows = filteredData.map((row) => [
      new Date(row.date).toLocaleDateString("en-US"),
      row.ctc,
      row.rpt,
      row.gfAndTf,
      row.dueFrom,
      row.rcdTotal,
      row.comment || "",
    ]);

    // Helper to escape values per CSV rules (double quotes doubled)
    const escapeCsv = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

    // Combine headers and rows
    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((r) => r.map(escapeCsv).join(',')),
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f7fa" }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.primary.dark }}
              >
                Financial Report Summary
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
              >
                Overview of collections, deductions, and net totals. Use the
                filters to refine the period.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`${month ? months[month - 1] : "All Months"} ${year || ""}`.trim()}
                color="primary"
                variant="outlined"
                sx={{ fontSize: "0.875rem", fontWeight: 500 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Filter and Actions Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            mb: 4,
            backgroundColor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filter Controls */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              minWidth: { sm: "400px" },
            }}
          >
            {/* Month Selector */}
            <TextField
              select
              fullWidth
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  backgroundColor: "background.default",
                },
              }}
            >
              <MenuItem value="">All Months</MenuItem>
              {months.map((m, index) => (
                <MenuItem key={index} value={index + 1}>
                  {m}
                </MenuItem>
              ))}
            </TextField>

            {/* Year Input */}
            <TextField
              fullWidth
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="e.g., 2025"
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  backgroundColor: "background.default",
                },
              }}
              InputProps={{
                inputProps: {
                  min: 2000,
                  max: new Date().getFullYear() + 5,
                },
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexShrink: 0,
              width: { xs: "100%", sm: "auto" },
              "& > *": {
                flex: { xs: 1, sm: "0 0 auto" },
              },
            }}
          >
            <Button
              type="button"
              variant="contained"
              color="primary"
              startIcon={<DescriptionOutlined />}
              onClick={handleGenerateReport}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                px: 3,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                },
              }}
            >
              Generate Full Report
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              startIcon={<DescriptionOutlined />}
              onClick={handleGenerateReport}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                px: 3,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                },
              }}
            >
              Check Report
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadOutlined />}
              onClick={handleExportCSV}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                px: 3,
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                },
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            "& .MuiTableCell-root": {
              py: 1.5,
              fontSize: "0.875rem",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "CTC",
                  "RPT",
                  "GF and TF",
                  "Due From",
                  "RCD Total",
                  "Remarks",
                  "Action",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                      "&:last-child": { borderRight: "none" },
                      py: 1.8,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <React.Fragment key={row.date || index}>
                    <TableRow
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#fafafa" : "#ffffff",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "#f0f4ff",
                          transform: "translateY(-1px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      {/* Date Cell */}
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          textAlign: "center",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(row.date))}
                      </TableCell>

                      {/* Editable Value Cells */}
                      {["ctc", "rpt", "gfAndTf"].map((field) => (
                        <TableCell
                          key={field}
                          sx={{
                            textAlign: "center",
                            position: "relative",
                            minWidth: 120,
                          }}
                        >
                          {editingField?.row === index &&
                          editingField?.field === field ? (
                            <TextField
                              value={inputValues[`${row.date}-${field}`] || ""}
                              onChange={(e) =>
                                handleInputChange(row.date, field, e.target.value)
                              }
                              size="small"
                              type="number"
                              sx={{
                                width: 100,
                                "& .MuiInputBase-input": {
                                  fontWeight: 500,
                                  textAlign: "center",
                                  py: 0.5,
                                },
                              }}
                              autoFocus
                            />
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>
                                ₱{Number(row[field] || 0).toLocaleString()}
                              </span>

                              {(row.adjustments?.[field]?.under > 0 ||
                                row.adjustments?.[field]?.over > 0) && (
                                <Tooltip
                                  title={
                                    <Box>
                                      {Number(row.adjustments?.[field]?.under || 0) > 0 && (
                                        <Box sx={{ color: theme.palette.error.main }}>
                                          Under: ₱{Number(row.adjustments?.[field]?.under || 0).toLocaleString()}
                                        </Box>
                                      )}
                                      {Number(row.adjustments?.[field]?.over || 0) > 0 && (
                                        <Box sx={{ color: theme.palette.success.main }}>
                                          Over: ₱{Number(row.adjustments?.[field]?.over || 0).toLocaleString()}
                                        </Box>
                                      )}
                                    </Box>
                                  }
                                >
                                  <ErrorIcon
                                    color="error"
                                    sx={{
                                      fontSize: 16,
                                      ml: 0.5,
                                      verticalAlign: "middle",
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          )}

                          <Collapse in={editableRow === index && showButtons} timeout={200}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                                mt: 1,
                                "& .MuiButton-root": {
                                  borderRadius: "6px",
                                  boxShadow: "none",
                                },
                              }}
                            >
                              <Button
                                type="button"
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleUnderClick(index, field)}
                                sx={{
                                  minWidth: 80,
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              >
                                Under
                              </Button>
                              <Button
                                type="button"
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleOverClick(index, field)}
                                sx={{
                                  minWidth: 80,
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              >
                                Over
                              </Button>
                            </Box>
                          </Collapse>
                        </TableCell>
                      ))}

                      {/* Due From Cell */}
                      <TableCell sx={{ textAlign: "center" }}>
                        <Collapse in={editableRow === index} timeout={200}>
                          <TextField
                            value={
                              !isNaN(updatedDueFrom[row.date])
                                ? updatedDueFrom[row.date]
                                : (row.dueFrom ?? "")
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              console.log("Input changed:", value);
                              setUpdatedDueFrom((prev) => ({
                                ...prev,
                                [row.date]: isNaN(value)
                                  ? prev[row.date]
                                  : value,
                              }));
                            }}
                            size="small"
                            sx={{
                              width: 100,
                              "& .MuiInputBase-input": {
                                fontWeight: 500,
                                textAlign: "center",
                                py: 0.5,
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">₱</InputAdornment>
                              ),
                            }}
                          />
                        </Collapse>
                        {editableRow !== index && (
                          <span style={{ fontWeight: 600 }}>
                            ₱{Number(row.dueFrom || 0).toLocaleString()}
                          </span>
                        )}
                      </TableCell>

                      {/* RCD Total Cell */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          fontWeight: 600,
                          color: theme.palette.success.dark,
                        }}
                      >
                        ₱{Number(row.rcdTotal || 0).toLocaleString()}
                      </TableCell>

                      {/* Remarks Cell */}
                      <TableCell>
                        <TextField
                          fullWidth
                          value={comments[row.date] || ""}
                          onChange={(e) =>
                            handleCommentChange(row.date, e.target.value)
                          }
                          size="small"
                          placeholder="Add comment..."
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: "6px",
                            },
                            "& .MuiInputBase-input": {
                              fontSize: "0.875rem",
                              py: 0.5,
                            },
                          }}
                        />
                      </TableCell>

                      {/* Action Cell */}
                      <TableCell sx={{ textAlign: "center" }}>
                        <Fade in={editableRow === index} timeout={200}>
                          <Box sx={{ display: editableRow === index ? 'inline-flex' : 'none', alignItems: 'center' }}>
                            <IconButton
                              type="button"
                              aria-label="save"
                              color="success"
                              onClick={() => handleSaveClick(index)}
                              disabled={savingRow === row.date}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                                },
                                transition: "all 0.2s",
                                transform: "scale(1.1)",
                                mr: 1,
                              }}
                            >
                              {savingRow === row.date ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <Save fontSize="small" />
                              )}
                            </IconButton>

                            <IconButton
                              type="button"
                              aria-label="cancel"
                              color="error"
                              onClick={() => setEditableRow(null)} // exit edit mode
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(211, 47, 47, 0.08)",
                                },
                                transition: "all 0.2s",
                                transform: "scale(1.1)",
                              }}
                            >
                              ✖
                            </IconButton>
                          </Box>
                        </Fade>

                        <Fade in={editableRow !== index} timeout={200}>
                          <Box sx={{ display: editableRow !== index ? 'inline-flex' : 'none' }}>
                            <IconButton
                              type="button"
                              aria-label="edit"
                              color="primary"
                              onClick={() => handleEditClick(index)}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                                },
                                transition: "all 0.2s",
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Box>
                        </Fade>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <InsertDriveFileOutlined
                        sx={{ fontSize: 48, mb: 1, opacity: 0.5 }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        No records found
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Try adjusting your filters
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Totals Row */}
              <TableRow
                sx={{
                  backgroundColor: theme.palette.success.light,
                  "& .MuiTableCell-root": {
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    py: 2,
                  },
                }}
              >
                <TableCell
                  colSpan={4}
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Grand Total
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: theme.palette.error.dark,
                  }}
                >
                  ₱
                  {totalDueFrom.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: theme.palette.success.dark,
                  }}
                >
                  ₱
                  {totalRcd.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            backgroundColor: "#f9fafb",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "stretch",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {/* RCD Total - Start */}
            <Card
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                borderTop: `4px solid ${theme.palette.success.main}`,
                minWidth: 250,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MonetizationOnIcon
                  sx={{ color: theme.palette.success.main, mr: 1 }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  TOTAL COLLECTIONS
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                RCD Total
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.success.main }}
              >
                ₱{totalRcd.toLocaleString("en-PH")}
              </Typography>
            </Card>

            {/* Due From - Center */}
            <Card
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                borderTop: `4px solid ${theme.palette.error.main}`,
                minWidth: 250,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingDownIcon
                  sx={{ color: theme.palette.error.main, mr: 1 }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  DEDUCTIONS
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Due From
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.error.main }}
              >
                ₱{totalDueFrom.toLocaleString("en-PH")}
              </Typography>
            </Card>

            {/* Net Collections - End */}
            <Card
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                minWidth: 250,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <BarChartIcon sx={{ color: "white", mr: 1 }} />
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  FINAL TOTAL
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Net Collections
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                ₱{totalCollections.toLocaleString("en-PH")}
              </Typography>
            </Card>
          </Box>
        </Paper>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              width: "100%",
              maxWidth: "400px",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              py: 2,
            }}
          >
            {isAdding ? "Add Adjustment" : "Subtract Adjustment"}
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {isAdding
                ? "Enter amount to add to "
                : "Enter amount to subtract from "}
              <strong>{dialogField}</strong>
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              type="number"
              variant="outlined"
              value={dialogInputValue}
              onChange={(e) => setDialogInputValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              type="button"
              onClick={() => setDialogOpen(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDialogConfirm}
              color="primary"
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                boxShadow: "none",
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      <GenerateReport
        open={reportDialog.open}
        onClose={handleCloseDialog}
        status={reportDialog.status}
        progress={reportDialog.progress}
      />
    </div>
  );
}

export default FullReport;
