// Make sure you have all necessary imports installed and adjust the import paths to match your folder structure.
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
import { saveAs } from "file-saver"; // npm install file-saver
import React, { useEffect, useState } from "react";
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import * as XLSX from "xlsx"; // npm install xlsx

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GavelIcon from "@mui/icons-material/Gavel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StorefrontIcon from "@mui/icons-material/Storefront";

// ---- Adjust these imports to your actual file paths ----
import axiosInstance from "../../../../api/axiosInstance";
import AbstractGF from "../../../../components/MD-Components/FillupForm/AbstractGF";
import GeneralFundDialogPopupDAILY from "../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupDailyTable";
import GeneralFundDialogPopupRFEE from "../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupRFEE";
import GeneralFundDialogPopupSUC from "../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupSUC";
import GeneralFundDialogPopupTOTAL from "../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupTOTAL";
import GeneralFundDialogPopupRF from "../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundReportPopupRF";
import GeneralFundDialogPopupTOB from "../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundReportPopupTOB";
import GeneralFundDialog from "../../../../components/MD-Components/Popup/GeneralFundDialog";
import PopupDialog from "../../../../components/MD-Components/Popup/PopupDialogGF_FORM";
import DailyTable from "./TableData/DailyTable";
import ReportTable from "./TableData/ReportTable";

import GenerateReport from "./TableData/GenerateReport";
// --------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  fontWeight: "bold",
  textAlign: "center",
  background: "linear-gradient(135deg, #1976d2, #63a4ff)",
  color: theme.palette.common.white,
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  fontSize: 14,
}));

//  gradient: "linear-gradient(135deg, #1976d2, #63a4ff)",

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};
const FloraMyImg = "/assets/images/Flora_My.jpg";
const RicardoImg = "/assets/images/Ricardo_Enopia.jpg";
const RowenaImg = "/assets/images/Rowena_Gaer.jpg";

// Map of cashier names to image paths
const cashierImages = {
  "FLORA MY": FloraMyImg,
  ROWENA: RowenaImg,
  RICARDO: RicardoImg,
};

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const years = [
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
];

function GeneralFund() {
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  // Table states

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Menu & selectedRow states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Totals
  const [allTotal, setAllTotal] = useState(0);
  const [taxOnBusinessTotal, setTaxOnBusinessTotal] = useState(0);
  const [regulatoryFeesTotal, setRegulatoryFeesTotal] = useState(0);
  const [serviceUserChargesTotal, setServiceUserChargesTotal] = useState(0);
  const [
    receiptsFromEconomicEnterprisesTotal,
    setReceiptsFromEconomicEnterprisesTotal,
  ] = useState(0);

  // Popup states
  // State for Popups
  const [openTOTAL, setOpenTOTAL] = useState(false);
  const [openTax, setOpenTax] = useState(false);
  const [openRf, setOpenRf] = useState(false);
  const [openSUC, setOpenSUC] = useState(false);
  const [openRFEE, setOpenRFEE] = useState(false);
  const [openDailyTable, setOpenDailyTable] = useState(false);

  // Show/hide different tables
  const [showDailyTable, setShowDailyTable] = useState(false);
  const [showMainTable, setShowMainTable] = useState(true);
  const [showReportTable, setShowReportTable] = useState(false);
  const [dailyTableData, setDailyTableData] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  const [rows, setRows] = React.useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [reportDialog, setReportDialog] = useState({
    open: false,
    status: "idle", // 'idle' | 'loading' | 'success' | 'error'
    progress: 0,
  });

  const ChhandleCloseDialog = () => {
    setReportDialog({ ...reportDialog, open: false });
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

  // Fetch main table data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("generalFundDataAll");
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    let newFiltered = data;

    // (a) Filter by searchQuery
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      newFiltered = newFiltered.filter((row) => {
        const rowName = (row?.name ?? "").toLowerCase();
        const rowCtcNo = (row?.receipt_no ?? "").toString().toLowerCase();
        // .includes() = partial substring match
        return rowName.includes(q) || rowCtcNo.includes(q);
      });
    }

    // (b) Filter by month/year
    if (month || year) {
      newFiltered = newFiltered.filter((row) => {
        if (!row.date) return false;
        const rowDate = new Date(row.date);
        const rowMonth = rowDate.getMonth() + 1;
        const rowYear = rowDate.getFullYear();

        const monthMatches = month ? rowMonth === parseInt(month) : true;
        const yearMatches = year ? rowYear === parseInt(year) : true;
        return monthMatches && yearMatches;
      });
    }

    setFilteredData(newFiltered);
    setPage(0); // reset pagination when filters change
  }, [data, searchQuery, month, year]);

  // Fetch overall total
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axiosInstance.get("TotalGeneralFunds");

        // ✅ Laravel returns: { overall_total: 12345.67 }
        const totalListingsGFTOTAL = parseFloat(
          response.data?.overall_total || 0
        );

        setAllTotal(totalListingsGFTOTAL);
      } catch (error) {
        console.error("❌ Error fetching total general fund:", error);
      }
    };

    fetchAllData();
  }, []);

  const getFilteredDataByMonthYear = () => {
    if (!month || !year) return filteredData;

    return filteredData.filter((row) => {
      if (!row.date) return false;
      const rowDate = new Date(row.date);
      return (
        rowDate.getMonth() + 1 === Number(month) &&
        rowDate.getFullYear() === Number(year)
      );
    });
  };

  // Fetch individual totals
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const endpoints = [
          "TaxOnBusinessTotal",
          "RegulatoryFeesTotal",
          "ServiceUserChargesTotal",
          "ReceiptsFromEconomicEnterprisesTotal",
        ];

        // Use default axios.all, but requests go through axiosInstance
        const responses = await axios.all(
          endpoints.map((endpoint) => axiosInstance.get(endpoint))
        );

        setTaxOnBusinessTotal(
          parseFloat(responses[0].data.tax_on_business || 0)
        );
        setRegulatoryFeesTotal(
          parseFloat(responses[1].data.regulatory_fees || 0)
        );
        setServiceUserChargesTotal(
          parseFloat(responses[2].data.service_user_charges || 0)
        );
        setReceiptsFromEconomicEnterprisesTotal(
          parseFloat(responses[3].data.receipts_from_economic_enterprises || 0)
        );
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };

    fetchTotals();
  }, []);

  // Search logic

  // Menu open
  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  // Menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // “View” from the menu
  const handleViewClick = () => {
    if (!selectedRow) return;
    setDialogContent(
      <GeneralFundDialog
        open={true}
        onClose={handleCloseDialog}
        data={selectedRow}
      />
    );
    setIsDialogOpen(true);
    handleMenuClose();
  };

  // Close the “View” dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Generic “Add” button
  const handleClickOpen = (content) => {
    setDialogContent(content);
    setShowMainTable(true);
    setIsDialogOpen(true);
    setShowDailyTable(false);
  };

  // Close the popup
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // TOTAL POPUP
  const handleClickTotal = () => {
    setOpenTOTAL(true);
  };
  const handleCloseTOTAL = () => {
    setOpenTOTAL(false);
  };
  const handleClickTax = () => {
    setOpenTax(true);
  };
  const handleCloseTax = () => {
    setOpenTax(false);
  };
  const handleClickRF = () => {
    setOpenRf(true);
  };
  const handleCloseRF = () => {
    // Fixed name
    setOpenRf(false);
  };
  const handleClickSUC = () => {
    setOpenSUC(true);
  };
  const handleCloseSUC = () => {
    setOpenSUC(false);
  };
  const handleClickRFEE = () => {
    setOpenRFEE(true);
  };
  const handleCloseRFEE = () => {
    setOpenRFEE(false);
  };

  // Daily table popup
  const handleCloseDailyTable = () => {
    setOpenDailyTable(false);
  };

  // Table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle sub-tables
  const toggleReportTable = () => {
    setShowReportTable(true);
    setShowMainTable(false);
    setShowDailyTable(false);
    setShowFilters(false);
  };
  const toggleDailyTable = () => {
    setShowDailyTable(true);
    setShowMainTable(false);
    setShowReportTable(false);
    setShowFilters(false);
  };
  const handleBack = () => {
    setShowReportTable(false);
    setShowDailyTable(false);
    setShowMainTable(true);
    setShowFilters(true);
  };

  // “Download” logic
  const handleDownload = () => {
    if (!month || !year) {
      setSnackbar({
        open: true,
        message: "Please select both month and year before downloading.",
        severity: "warning",
      });
      return;
    }

    const filteredExportData = getFilteredDataByMonthYear();

    if (filteredExportData.length === 0) {
      setSnackbar({
        open: true,
        message:
          "No data available to download for the selected month and year.",
        severity: "info",
      });
      return;
    }

    // Convert date to Philippine Time and human-readable format
    const formattedData = filteredExportData.map((item) => {
      return {
        ...item,
        DATE: new Date(item.DATE).toLocaleString("en-US", {
          timeZone: "Asia/Manila", // Set timezone to PHT
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    const file = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([file], { type: "application/octet-stream" });
    const fileName = `GeneralFund_Report_${months.find((m) => m.value === month)?.label}_${year}.xlsx`;
    saveAs(blob, fileName);
  };

  const handleEditClick = () => {
    if (!selectedRow) return;

    setDialogContent(<AbstractGF data={selectedRow} mode="edit" />);

    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleSearchClick = () => {
    // Move whatever is typed in pendingSearchQuery into searchQuery
    // This triggers the filter in the useEffect
    setSearchQuery(pendingSearchQuery);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await axiosInstance.delete(`deleteGF/${selectedId}`);

      if (response.status === 200) {
        alert("Record deleted successfully");
        setRows((prev) => prev.filter((row) => row.id !== selectedId));
      } else {
        alert(response.data?.error || "Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedId(null);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Search & Filters Row */}
        <Box display="flex" alignItems="center" gap={3} sx={{ py: 2 }}>
          {showFilters && (
            <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Records"
                placeholder="Name or Receipt Number"
                value={pendingSearchQuery}
                onChange={(e) => setPendingSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "8px" },
                }}
              />
              <Box display="flex" gap={2}>
                <Autocomplete
                  disablePortal
                  options={months}
                  sx={{ width: 180 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Month"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => setMonth(v?.value)}
                />

                <Autocomplete
                  disablePortal
                  options={years}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Year"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => setYear(v?.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 4,
                    height: "56px",
                    color: "white",
                    borderRadius: "8px",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)" },
                  }}
                  onClick={handleSearchClick}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Action Buttons Row */}
        <Box display="flex" alignItems="center" gap={2} sx={{ py: 1 }}>
          <Box display="flex" gap={2} flexGrow={1}>
            {/* New Entry - Primary CTA */}
            <Tooltip title="Add New Entry" arrow>
              <Button
                variant="contained"
                startIcon={<IoMdAdd size={18} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "translateY(-1px)",
                    boxShadow: "0 3px 10px rgba(25, 118, 210, 0.3)",
                  },
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "10px",
                  minWidth: "130px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(25, 118, 210, 0.2)",
                }}
                onClick={() =>
                  handleClickOpen(<AbstractGF onClose={handleClose} />)
                }
              >
                New Entry
              </Button>
            </Tooltip>

            {/* Daily Report */}
            <Tooltip title="Generate Daily Report" arrow>
              <Button
                variant="contained"
                color="success"
                startIcon={<IoToday size={16} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#2e7d32",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1b5e20",
                    transform: "translateY(-1px)",
                  },
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "10px",
                  minWidth: "130px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(46, 125, 50, 0.2)",
                }}
                onClick={toggleDailyTable}
              >
                Daily Report
              </Button>
            </Tooltip>

            {/* Check Receipt */}
            <Tooltip title="Generate Receipt Report" arrow>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ReceiptIcon size={16} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#7b1fa2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#6a1b9a",
                    transform: "translateY(-1px)",
                  },
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "10px",
                  minWidth: "130px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(123, 31, 162, 0.2)",
                }}
                onClick={handleGenerateReport}
              >
                Check Receipt
              </Button>
            </Tooltip>
          </Box>

          <Box display="flex" gap={2}>
            {/* Financial Report */}
            <Tooltip title="Financial Reports" arrow>
              <Button
                variant="contained"
                color="error"
                startIcon={<BiSolidReport size={18} />}
                onClick={toggleReportTable}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "error.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Financial Report
              </Button>
            </Tooltip>

            {/* Download */}
            <Tooltip title="Export Data" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<IoMdDownload size={18} />}
                onClick={handleDownload}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  color: "white",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "info.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Download
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={3}
          sx={{
            mt: 4,
            flexDirection: { xs: "column", sm: "row" }, // Responsive layout
          }}
        >
          {[
            {
              value: allTotal,
              text: "Total Revenue",
              icon: <AccountBalanceIcon />,
              gradient: "linear-gradient(135deg, #1976d2, #63a4ff)",
              onClick: handleClickTotal,
            },
            {
              value: taxOnBusinessTotal,
              text: "Tax on Business",
              icon: <BusinessCenterIcon />,
              gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)",
              onClick: handleClickTax,
            },
            {
              value: regulatoryFeesTotal,
              text: "Regulatory Fees",
              icon: <GavelIcon />,
              gradient: "linear-gradient(135deg, #ed6c02, #ffb74d)",
              onClick: handleClickRF,
            },
            {
              value: receiptsFromEconomicEnterprisesTotal,
              text: "Receipts from Economic Enterprises",
              icon: <StorefrontIcon />,
              gradient: "linear-gradient(135deg, #6a1b9a, #ab47bc)",
              onClick: handleClickRFEE,
            },
            {
              value: serviceUserChargesTotal,
              text: "Service User Charges",
              icon: <ReceiptLongIcon />,
              gradient: "linear-gradient(135deg, #00838f, #4dd0e1)",
              onClick: handleClickSUC,
            },
          ].map(({ value, text, icon, gradient, onClick }) => (
            <Card
              key={text}
              onClick={onClick}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: "16px",
                background: gradient,
                color: "white",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                cursor: "pointer",
                minWidth: 0,
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "100%",
                  height: "100%",
                  background: "rgba(255,255,255,0.1)",
                  transform: "rotate(30deg)",
                  transition: "all 0.4s ease",
                },
                "&:hover::before": {
                  transform: "rotate(30deg) translate(20%, 20%)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      opacity: 0.9,
                      mb: 0.5,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {text}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      lineHeight: 1.2,
                      mb: 1,
                    }}
                  >
                    {typeof value === "number"
                      ? new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 2,
                        }).format(value)
                      : value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    opacity: 0.2,
                    position: "absolute",
                    right: 20,
                    top: 20,
                    "& svg": {
                      fontSize: "3.5rem",
                    },
                  }}
                >
                  {icon}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: "70%", // Adjust dynamically if needed
                      height: "100%",
                      backgroundColor: "white",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
      
      {/* Sub-tables */}
      {showDailyTable && (
        <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} />
      )}
      {showReportTable && <ReportTable onBack={handleBack} />}
      {/* Main table */}
      {showMainTable && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 6,
            overflow: "hidden",
            "& .MuiTableCell-root": {
              py: 2,
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>DATE</StyledTableCell>
                <StyledTableCell>NAME OF TAXPAYER</StyledTableCell>
                <StyledTableCell>RECEIPT NO.</StyledTableCell>
                <StyledTableCell>CASHIER</StyledTableCell>
                <StyledTableCell>TYPE OF RECEIPT</StyledTableCell>
                <StyledTableCell>TOTAL</StyledTableCell>
                <StyledTableCell>ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(row.date)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">{row.name}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2">{row.receipt_no}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                      >
                        <Avatar
                          src={
                            cashierImages[row.cashier] || "default_image_path"
                          }
                          alt={row.cashier}
                          sx={{ width: 36, height: 36 }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {row.cashier}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={row.type_receipt}
                        color="info"
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="success.main"
                      >
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 2,
                        }).format(row.total)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(event) => handleMenuClick(event, row)}
                        sx={{
                          textTransform: "none",
                          px: 2,
                          py: 0.75,
                          fontSize: "0.75rem",
                          borderRadius: 2,
                        }}
                      >
                        Actions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            m={2}
          >
            <TablePagination
              rowsPerPageOptions={[10, 15, 20, 30, 50, 100]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </TableContainer>
      )}
      {/* Single menu for ACTIONS */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewClick}>View</MenuItem>
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation(); // Prevent event propagation
            setSelectedId(rows.id);
            setOpenDeleteDialog(true);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      {/* Popup for "Add" or "View" content */}
      {isDialogOpen && (
        <PopupDialog open={isDialogOpen} onClose={handleClose}>
          {dialogContent}
        </PopupDialog>
      )}
      <Box>
        {/*Snackbar Component (with prop fixes)*/}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      {/* Totals popups */}
      <GeneralFundDialogPopupTOB open={openTax} onClose={handleCloseTax} />
      <GeneralFundDialogPopupRF open={openRf} onClose={handleCloseRF} />{" "}
      {/* Fixed handler */}
      <GeneralFundDialogPopupSUC open={openSUC} onClose={handleCloseSUC} />
      <GeneralFundDialogPopupRFEE open={openRFEE} onClose={handleCloseRFEE} />
      <GeneralFundDialogPopupTOTAL
        open={openTOTAL}
        onClose={handleCloseTOTAL}
      />
      {/* Daily table popup (if needed) */}
      <GeneralFundDialogPopupDAILY
        open={openDailyTable}
        onClose={handleCloseDailyTable}
      />
      {/* Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
      <GenerateReport
        open={reportDialog.open}
        onClose={ChhandleCloseDialog}
        status={reportDialog.status}
        progress={reportDialog.progress}
      />
    </Box>
  );
}

export default GeneralFund;
