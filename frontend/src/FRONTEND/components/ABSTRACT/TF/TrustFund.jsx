import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText, DialogTitle,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import * as XLSX from "xlsx";
import axiosInstance from "../../../../api/axiosInstance";

import TrustFunds from "../../../../components/MD-Components/FillupForm/AbstractTF";
import PopupDialog from "../../../../components/MD-Components/Popup/PopupDialogTF_FORM";
import TrustFundDialog from "../../../../components/MD-Components/Popup/TrustFundDialog";
import ReportTable from "./TableData/components/ReportTable";

import TrustFundDialogPopupBPF from "../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupBPF";
import TrustFundDialogPopupDF from "../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupDF";
import TrustFundDialogPopupEPF from "../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupEPF";
import TrustFundDialogPopupLDF from "../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupLDF";
import TrustFundDialogPopupTOTAL from "../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupTOTAL";
import TrustFundDialogPopupZF from "../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupZF";


import DailyTable from "./TableData/DailyTable";
import GenerateReport from './TableData/GenerateReport';

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import PoolIcon from "@mui/icons-material/Pool";

const FloraMyImg = "/assets/images/Flora_My.jpg";
const RicardoImg = "/assets/images/Ricardo_Enopia.jpg";
const RowenaImg = "/assets/images/Rowena_Gaer.jpg";

// Custom styled table cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  fontWeight: "bold",
  textAlign: "center",
  background: "linear-gradient(135deg, #1976d2, #63a4ff)",
  color: theme.palette.common.white,
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  fontSize: 14,
}));


// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

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


function TrustFund() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [anchorEl, setAnchorEl] = useState(null);
  const [allTotal, setAllTotal] = useState(0);

  const [openBPF, setOpenBPF] = useState(false);
  const [openDF, setOpenDF] = useState(false);
  const [openEPF, setOpenEPF] = useState(false);
  const [openZF, setOpenZF] = useState(false);
  const [openLDF, setOpenLDF] = useState(false);
  const [openTOTAL, setOpenTOTAL] = useState(false);

   const [rows, setRows] = React.useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
  

  const [buildingPermitFee, setBuildingPermitFee] = useState(0);
  const [electricalFee, setElectricalFee] = useState(0);
  const [zoningFee, setZoningFee] = useState(0);
  const [livestockDevFund, setLivestockDevFund] = useState(0);
  const [divingFee, setDivingFee] = useState(0);

  const [showMainTable, setShowMainTable] = useState(true);
  const [showDailyTable, setShowDailyTable] = useState(false);
  const [dailyTableData, setDailyTableData] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [showReportTable, setShowReportTable] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  // 3. Search states:
  //    a) what user is typing
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  //    b) what we actually filter on
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const fetchTotal = async (endpoint) => {
          const response = await axiosInstance.get(`${endpoint}`);
          return response.data;
        };

        const [
          buildingPermitFeeData,
          electricalFeeData,
          zoningFeeData,
          livestockDevFundData,
          divingFeeData,
        ] = await Promise.all([
          fetchTotal("BuildingPermitFeeTotal"),
          fetchTotal("ElectricalFeeTotal"),
          fetchTotal("ZoningFeeTotal"),
          fetchTotal("LivestockDevFundTotal"),
          fetchTotal("DivingFeeTotal"),
        ]);

        setBuildingPermitFee(
          parseFloat(buildingPermitFeeData.building_permit_fee_total || 0)
        );
        setElectricalFee(
          parseFloat(electricalFeeData.electrical_fee_total || 0)
        );
        setZoningFee(parseFloat(zoningFeeData.zoning_fee_total || 0));
        setLivestockDevFund(
          parseFloat(livestockDevFundData.livestock_dev_fund_total || 0)
        );
        setDivingFee(parseFloat(divingFeeData.diving_fee_total || 0));
      } catch (error) {
        console.error(
          "Error fetching totals:",
          error.response?.data || error.message
        );
      }
    };

    fetchTotals();
  }, []);

   const [reportDialog, setReportDialog] = useState({
        open: false,
        status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
        progress: 0
      });
    
      const ChhandleCloseDialog = () => {
        setReportDialog({ ...reportDialog, open: false });
      };
  
      const handleGenerateReport = () => {
        // Open dialog in loading state
        setReportDialog({
          open: true,
          status: 'loading',
          progress: 0
        });
    
        // Simulate report generation
        const interval = setInterval(() => {
          setReportDialog(prev => {
            const newProgress = prev.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...prev, status: 'success', progress: 100 };
            }
            return { ...prev, progress: newProgress };
          });
        }, 300);
      };

  const handleEditClick = () => {
    if (!selectedRow) return;
    setDialogContent(
      <TrustFunds
        // Pass the data from the selected row
        data={selectedRow}
        // If you want a custom prop to indicate "edit mode", you can do:
        mode="edit"
      />
    );
    setIsDialogOpen(true);
    handleMenuClose();
  };

  // ------------------------
  //  1) Fetch data once
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("table-trust-fund-all");
        setData(response.data);
        setFilteredData(response.data); // Initialize with the full dataset
      } catch (error) {
        console.error(
          "Error fetching table-trust-fund-all data:",
          error.message
        );
      }
    };

    fetchData();
  }, []);

  // ------------------------
  //  2) Filter by Month & Year
  // ------------------------
  const getFilteredDataByMonthYear = () => {
    if (!month || !year) return filteredData;

    return filteredData.filter((row) => {
      if (!row.DATE) return false;
      const rowDate = new Date(row.DATE);
      return (
        rowDate.getMonth() + 1 === Number(month) &&
        rowDate.getFullYear() === Number(year)
      );
    });
  };

  // ------------------------
  //  2) Filter data on searchQuery & month/year
  // ------------------------
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
        const rowName = (row?.NAME ?? "").toLowerCase();
        const rowCtcNo = (row?.RECEIPT_NO ?? "").toString().toLowerCase();
        // .includes() = partial substring match
        return rowName.includes(q) || rowCtcNo.includes(q);
      });
    }

    // (b) Filter by month/year
    if (month || year) {
      newFiltered = newFiltered.filter((row) => {
        if (!row.DATE) return false;
        const rowDate = new Date(row.DATE);
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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axiosInstance.get("trust-fund-total");

        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setAllTotal(parseFloat(data[0]?.overall_total) || 0);
        } else {
          console.warn("No data received for trust-fund-total");
          setAllTotal(0);
        }
      } catch (error) {
        console.error(
          "Error fetching trust-fund-total data:",
          error.response?.data || error.message
        );
        setAllTotal(0); // Fallback in case of error
      }
    };

    fetchAllData();
  }, []);

  // ------------------------
  //  8) Handler for the Search button
  // ------------------------
  const handleSearchClick = () => {
    // Move whatever is typed in pendingSearchQuery into searchQuery
    // This triggers the filter in the useEffect
    setSearchQuery(pendingSearchQuery);
  };

  const handleClickOpen = (content) => {
    setDialogContent(content);
    setIsDialogOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Close the “View” dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleViewClick = () => {
    if (!selectedRow) return;

    setDialogContent(
      <TrustFundDialog
        open={true}
        onClose={handleCloseDialog}
        data={selectedRow || {}} // Fallback to an empty object
      />
    );
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleCloseBPF = () => {
    setOpenBPF(false);
  };

  const handleCloseDF = () => {
    setOpenDF(false);
  };

  const handleCloseEPF = () => {
    setOpenEPF(false);
  };

  const handleCloseZF = () => {
    setOpenZF(false);
  };

  const handleCloseLDF = () => {
    setOpenLDF(false);
  };

  const handleCloseTOTAL = () => {
    setOpenTOTAL(false);
  };

  const handleClickBPF = () => {
    setOpenBPF(true);
  };

  const handleClickDF = () => {
    setOpenDF(true);
  };

  const handleClickEPF = () => {
    setOpenEPF(true);
  };

  const handleClickZF = () => {
    setOpenZF(true);
  };

  const handleClickLDF = () => {
    setOpenLDF(true);
  };

  const handleClickTOTAL = () => {
    setOpenTOTAL(true);
  };

  const handleBack = () => {
    setShowReportTable(false);
    setShowDailyTable(false);
    setShowMainTable(true);
    setShowFilters(true);
  };

  const toggleDailyTable = () => {
    setShowDailyTable(true);
    setShowMainTable(false);
    setShowReportTable(false);
    setShowFilters(false);
  };

  // Toggle sub-tables
  const toggleReportTable = () => {
    setShowReportTable(true);
    setShowMainTable(false);
    setShowDailyTable(false);
    setShowFilters(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    
    try {
      const response = await fetch(`/api/deleteTF/${selectedId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        alert("Record deleted successfully");
        setRows(prev => prev.filter(row => row.id !== selectedId));
      } else {
        alert(result.error || "Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedId(null);
    }
  };

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
    const fileName = `TrustFund_Report_${months.find((m) => m.value === month)?.label}_${year}.xlsx`;
    saveAs(blob, fileName);
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
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                  root: {
                    sx: { borderRadius: "8px" },
                  },
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
                  handleClickOpen(<TrustFunds onClose={handleClose} />)
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

        {/* Summary Cards - Updated Style */}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={3}
          sx={{
            mt: 4,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {[
            {
              value: allTotal,
              text: "Total",
              icon: <AccountBalanceIcon />, // replace with your desired icon
              gradient: "linear-gradient(135deg, #3f51b5, #5c6bc0)",
              onClick: handleClickTOTAL,
            },
            {
              value: buildingPermitFee,
              text: "Building Permit Fee",
              icon: <HomeIcon />, // replace with a relevant icon
              gradient: "linear-gradient(135deg, #1976d2, #63a4ff)",
              onClick: handleClickBPF,
            },
            {
              value: electricalFee,
              text: "Electrical Fee",
              icon: <FlashOnIcon />, // replace with a relevant icon
              gradient: "linear-gradient(135deg, #f57c00, #ffb74d)",
              onClick: handleClickEPF,
            },
            {
              value: zoningFee,
              text: "Zoning Fee",
              icon: <MapIcon />, // replace with a relevant icon
              gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)",
              onClick: handleClickZF,
            },
            {
              value: livestockDevFund,
              text: "Livestock Dev Fund",
              icon: <AgricultureIcon />, // replace with a relevant icon
              gradient: "linear-gradient(135deg, #6a1b9a, #ab47bc)",
              onClick: handleClickLDF,
            },
            {
              value: divingFee,
              text: "Diving Fee",
              icon: <PoolIcon />, // replace with a relevant icon
              gradient: "linear-gradient(135deg, #00838f, #4dd0e1)",
              onClick: handleClickDF,
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
                      width: "70%",
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

      {showDailyTable && (
        <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} />
      )}
      {showReportTable && <ReportTable onBack={handleBack} />}

      {showMainTable && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            "& .MuiTableCell-root": {
              py: 2,
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Receipt No.</StyledTableCell>
                <StyledTableCell>Name of Taxpayer</StyledTableCell>
                <StyledTableCell>Cashier</StyledTableCell>
                <StyledTableCell>Type of Receipt</StyledTableCell>
                <StyledTableCell>Total</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id || row.RECEIPT_NO} hover>
                    <TableCell align="center">{formatDate(row.DATE)}</TableCell>
                    <TableCell align="center">{row.RECEIPT_NO}</TableCell>
                    <TableCell align="center">{row.NAME}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <img
                          src={
                            cashierImages[row.CASHIER] || "default_image_path"
                          }
                          alt={row.CASHIER}
                          style={{ width: 40, height: 40, borderRadius: "50%" }}
                        />
                        <Box>{row.CASHIER}</Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{row.TYPE_OF_RECEIPT}</TableCell>
                    <TableCell align="center">
                      {" "}
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="success.main"
                      >
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 2,
                        }).format(row.TOTAL)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleMenuClick(event, row)}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        ACTIONS
                      </Button>
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
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            m={1}
          >
            <TablePagination
              rowsPerPageOptions={[5, 10]}
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

      <TrustFundDialogPopupBPF open={openBPF} onClose={handleCloseBPF} />
      <TrustFundDialogPopupDF open={openDF} onClose={handleCloseDF} />
      <TrustFundDialogPopupEPF open={openEPF} onClose={handleCloseEPF} />
      <TrustFundDialogPopupZF open={openZF} onClose={handleCloseZF} />
      <TrustFundDialogPopupLDF open={openLDF} onClose={handleCloseLDF} />
      <TrustFundDialogPopupTOTAL open={openTOTAL} onClose={handleCloseTOTAL} />

      <GenerateReport
        open={reportDialog.open}
        onClose={ChhandleCloseDialog}
        status={reportDialog.status}
        progress={reportDialog.progress}
      />
    </Box>
  );
}

export default TrustFund;
