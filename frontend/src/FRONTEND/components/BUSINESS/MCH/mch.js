import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance.js";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,Stack  
} from "@mui/material";

import TablePagination from "@mui/material/TablePagination";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GavelIcon from "@mui/icons-material/Gavel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BploForm from "./form/BploForm";
import BPLODialogPopupTOTAL from "./bplo_popup_Dialog/BPLODialogPopupTOTAL";
import BPLODialogPopupREGISTERED from "./bplo_popup_Dialog/BPLODialogPopupRegistered.jsx";
import BPLODialogPopupRENEW from "./bplo_popup_Dialog/BPLODialogPopupRenew.jsx";
import BPLODialogPopupEXPIRY from "./bplo_popup_Dialog/BPLODialogPopupExpiry.jsx";
import BPLODialogPopupEXPIRE from "./bplo_popup_Dialog/BPLODialogPopupExpired.jsx";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  fontWeight: "bold",
  textAlign: "center",
  background: "linear-gradient(135deg, #1976d2, #63a4ff)",
  color: theme.palette.common.white,
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  fontSize: 14,
}));

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

function FrontPage() {
   const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog state
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null); // ✅ NEW STATE

  // Menu state for print
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  //FILTERS
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);

  //TOTAL
  const [allTotal, setAllTotal] = useState(0);
  const [registered, setRegistered] = useState(0);
  const [renew, setRenew] = useState(0);
  const [expiry, setExpiry] = useState(0);
  const [expired, setExpired] = useState(0);

  // State for Popups
  const [openTotalRevenue, setOpenTotalRevenue] = useState(false);
  const [openTotalRegistered, setOpenTotalRegistered] = useState(false);
  const [openTotalRenew, setOpenTotalRenew] = useState(false);
  const [openTotalExpiry, setOpenTotalExpiry] = useState(false);
  const [openTotalExpire, setOpenTotalExpire] = useState(false);




// Fetch overall total
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axiosInstance.get("bplo/total-revenue/overall");

        // ✅ Laravel returns: { overall_total: 12345.67 }
        const totalRevenue = parseFloat(
          response.data?.overall_total || 0
        );

        setAllTotal(totalRevenue);
      } catch (error) {
        console.error("❌ Error fetching total general fund:", error);
      }
    };

    fetchAllData();
  }, []);


  // Fetch overall registered
useEffect(() => {
  const fetchAllData = async () => {
    try {
      const response = await axiosInstance.get("TotalRegistered");

      // Laravel returns: { overall_registered: 155 }
      const totalRegistered = parseInt(response.data?.overall_registered || 0);

      setRegistered(totalRegistered);
    } catch (error) {
      console.error("❌ Error fetching total registered:", error);
    }
  };

  fetchAllData();
}, []);

//Fetch Total Renewed
useEffect(() => {
  const fetchRenewData = async () => {
    try {
      const response = await axiosInstance.get("total-renew");

      // Laravel returns: { overall_renew: 123, year: 2025 }
      const totalRenew = parseInt(response.data?.overall_renew || 0);

      setRenew(totalRenew);
    } catch (error) {
      console.error("❌ Error fetching total renew:", error);
    }
  };

  fetchRenewData();
}, []);


//Total Expiry
useEffect(() => {
  const fetchExpiryData = async () => {
    try {
      const response = await axiosInstance.get("TotalExpiry");
      const totalExpiry = parseInt(response.data?.overall_expiry || 0);
      setExpiry(totalExpiry);
    } catch (error) {
      console.error("❌ Error fetching total expiry:", error);
    }
  };

  fetchExpiryData();
}, []);


//Total Expired
useEffect(() => {
  const fetchExpiredData = async () => {
    try {
      const response = await axiosInstance.get("TotalExpired");
      const totalExpired = parseInt(response.data?.overall_expired || 0);
      setExpired(totalExpired);
    } catch (error) {
      console.error("❌ Error fetching total expired:", error);
    }
  };

  fetchExpiredData();
}, []);


  const handleOpenForm = () => setOpenForm(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
  try {
    const response = await axiosInstance.get("bplo");
    setRecords(response.data);
    setFilteredRecords(response.data); // 👈 default display
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

const applyFilters = () => {
  let filtered = [...records];

  // 🔍 Filter by name or receipt
  if (search.trim() !== "") {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        (r.FNAME && r.FNAME.toLowerCase().includes(lowerSearch)) ||
        (r.LNAME && r.LNAME.toLowerCase().includes(lowerSearch)) ||
        (r.RECEIPT_NO && r.RECEIPT_NO.toLowerCase().includes(lowerSearch)) ||
        (r.TRANSACTION_CODE && r.TRANSACTION_CODE.toLowerCase().includes(lowerSearch))
    );
  }

  // 📅 Filter by month/year
  filtered = filtered.filter((r) => {
    if (!r.RENEW_FROM) return false;
    const date = new Date(r.RENEW_FROM);
    const month = date.getMonth(); // 0–11
    const year = date.getFullYear();

    let valid = true;
    if (selectedMonth) valid = valid && month === selectedMonth.value;
    if (selectedYear) valid = valid && year === selectedYear.value;

    return valid;
  });

  setFilteredRecords(filtered);
  setPage(0); // reset pagination
};
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  // Menu handlers
  const handleMenuOpen = (event, record) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecord(null);
  };

  const handlePrint = (type) => {
    handleMenuClose();
    if (!selectedRecord) return console.warn("No record selected for printing");

    const base = "http://localhost/BPLO_FRANCHISE/php_scripts";
    let url = "";

    switch (type) {
      case "application":
        url = `${base}/fill_pdf_application.php?id=${selectedRecord.ID}`;
        break;
      case "certification":
        url = `${base}/fill_pdf_certification.php?id=${selectedRecord.ID}`;
        break;
      case "order":
        url = `${base}/fill_pdf_order.php?id=${selectedRecord.ID}`;
        break;
      case "pnp":
        url = `${base}/fill_pdf_pnp_motor_vehicle_clearance_certification.php?id=${selectedRecord.ID}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
  };

  const handleView = (record) => {
    console.log("Viewing record:", record);
  };

  // ✅ EDIT BUTTON FUNCTION
  const handleUpdate = (record) => {
    setEditData(record);     // Pass selected record
    setOpenForm(true);       // Open dialog
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosInstance.delete(`/bplo/${id}`);
        alert("✅ Record deleted successfully!");
        fetchRecords();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("❌ Failed to delete record.");
      }
    }
  };

  // ✅ When dialog closes, reset editData
  const handleCloseForm = () => {
    setOpenForm(false);
    setEditData(null);
    fetchRecords(); // refresh list after save/update
  };


  // TOTAL POPUP
  const handleClickTotalRevenue = () => {
    setOpenTotalRevenue(true);
  };
  const handleCloseTOTALRevenue = () => {
    setOpenTotalRevenue(false);
  };

  const handleClickTotalRegistered = () => {
    setOpenTotalRegistered(true);
  };
  const handleCloseTotalRegistered = () => {
    setOpenTotalRegistered(false);
  };

   const handleClickTotalRenew = () => {
    setOpenTotalRenew(true);
  };
  const handleCloseTotalRenew = () => {
    setOpenTotalRenew(false);
  };

  const handleClickTotalExpiry = () => {
    setOpenTotalExpiry(true);
  };
  const handleCloseTotalExpiry = () => {
    setOpenTotalExpiry(false);
  };

  const handleClickTotalExpire = () => {
    setOpenTotalExpire(true);
  };
  const handleCloseTotalExpire = () => {
    setOpenTotalExpire(false);
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
          <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
           <TextField
      fullWidth
      variant="outlined"
      label="Search Records"
      placeholder="Name or Receipt Number"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{/* optional icon */}</InputAdornment>
        ),
        sx: { borderRadius: "8px" },
      }}
    />
            <Box display="flex" gap={2}>
              <Autocomplete
        disablePortal
        options={[
          { label: "January", value: 0 },
          { label: "February", value: 1 },
          { label: "March", value: 2 },
          { label: "April", value: 3 },
          { label: "May", value: 4 },
          { label: "June", value: 5 },
          { label: "July", value: 6 },
          { label: "August", value: 7 },
          { label: "September", value: 8 },
          { label: "October", value: 9 },
          { label: "November", value: 10 },
          { label: "December", value: 11 },
        ]}
        value={selectedMonth}
        onChange={(e, newVal) => setSelectedMonth(newVal)}
        sx={{ width: 180 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Month" variant="outlined" />
        )}
      />

      <Autocomplete
        disablePortal
        options={Array.from({ length: 6 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { label: `${year}`, value: year };
        })}
        value={selectedYear}
        onChange={(e, newVal) => setSelectedYear(newVal)}
        sx={{ width: 150 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Year" variant="outlined" />
        )}
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
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons Row */}
        <Box display="flex" alignItems="center" gap={2} sx={{ py: 1 }}>
          <Box display="flex" gap={2} flexGrow={1}>
            <Tooltip title="Add New Entry" arrow>
              <Button
                variant="contained"
                sx={{
                  px: 3.5,
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "translateY(-1px)",
                  },
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "10px",
                  minWidth: "130px",
                  height: "44px",
                }}
                onClick={handleOpenForm} // ✅ fixed
              >
                New Entry
              </Button>
            </Tooltip>

            <Tooltip title="Generate Daily Report" arrow>
              <Button
                variant="contained"
                color="success"
                sx={{
                  px: 3.5,
                  backgroundColor: "#2e7d32",
                  color: "white",
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
              >
                Renew
              </Button>
            </Tooltip>

            <Tooltip title="Generate Receipt Report" arrow>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  px: 3.5,
                  backgroundColor: "#7b1fa2",
                  color: "white",
                  "&:hover": { backgroundColor: "#6a1b9a" },
                }}
              >
                Drop
              </Button>
            </Tooltip>
          </Box>

          <Box display="flex" gap={2}>
            <Tooltip title="Financial Reports" arrow>
              <Button variant="contained" color="error">
                Financial Report
              </Button>
            </Tooltip>
            <Tooltip title="Export Data" arrow>
              <Button variant="contained" color="info">
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
  sx={{ mt: 4, flexDirection: { xs: "column", sm: "row" } }}
>
  {[
  {
    value: allTotal,
    text: "Total Revenue",
    icon: <AccountBalanceIcon />,
    gradient: "linear-gradient(135deg, #1976d2, #63a4ff)",
    onClick: handleClickTotalRevenue, // use your defined function name
  },
  {
    value: registered,
    text: "Total Registered",
    icon: <BusinessCenterIcon />,
    gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)",
    onClick: handleClickTotalRegistered,
  },
  {
    value: renew,
    text: "Total Renew",
    icon: <GavelIcon />,
    gradient: "linear-gradient(135deg, #ed6c02, #ffb74d)",
    onClick: handleClickTotalRenew,
  },
  {
    value: expiry,
    text: "Total Expiry",
    icon: <StorefrontIcon />,
    gradient: "linear-gradient(135deg, #6a1b9a, #ab47bc)",
    onClick: handleClickTotalExpiry,
  },
  {
    value: expired,
    text: "Total Expired",
    icon: <ReceiptLongIcon />,
    gradient: "linear-gradient(135deg, #00838f, #4dd0e1)",
    onClick: handleClickTotalExpire,
  },
{
    value: 0,
    text: "Total Not Registered",
    icon: <ReceiptLongIcon />,
    gradient: "linear-gradient(135deg, #8f0053ff, #e14d72ff)",

  },

].map(({ text, icon, gradient, value, onClick }) => (
  <Card
    key={text}
    onClick={onClick} // ✅ now clickable
    sx={{
      flex: 1,
      p: 3,
      borderRadius: "16px",
      background: gradient,
      color: "white",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      cursor: onClick ? "pointer" : "default", // nice UX touch
      transition: "transform 0.2s",
      "&:hover": onClick ? { transform: "scale(1.03)" } : {},
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="subtitle2">{text}</Typography>
        <Typography variant="h5">
          {text === "Total Revenue" ? `₱${value.toLocaleString()}` : value}
        </Typography>
      </Box>
      <Box sx={{ opacity: 0.2 }}>{icon}</Box>
    </Box>
  </Card>
))}
</Box>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 6, mt: 4 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>NAME</StyledTableCell>
              <StyledTableCell>BARANGAY</StyledTableCell>
              <StyledTableCell>MAKE</StyledTableCell>
              <StyledTableCell>MCH NO</StyledTableCell>
              <StyledTableCell>CASE NO</StyledTableCell>
              <StyledTableCell>RENEW FROM</StyledTableCell>
              <StyledTableCell>RENEW TO</StyledTableCell>
              <StyledTableCell>STATUS</StyledTableCell>
              <StyledTableCell>ACTION</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((r) => (
                <TableRow key={r.ID} hover>
                  <TableCell align="center">
                    {r.FNAME} {r.LNAME}
                  </TableCell>
                  <TableCell align="center">{r.BARANGAY}</TableCell>
                  <TableCell align="center">{r.MAKE}</TableCell>
                  <TableCell align="center">{r.MCH_NO}</TableCell>
                  <TableCell align="center">{r.FRANCHISE_NO}</TableCell>
                  <TableCell align="center">{formatDate(r.RENEW_FROM)}</TableCell>
                  <TableCell align="center">{formatDate(r.RENEW_TO)}</TableCell>
                  <TableCell align="center">
  <Chip
    label={r.STATUS || "Pending"}
    color={
      r.STATUS === "Renew"
        ? "success"
        : r.STATUS === "Expired"
        ? "error"
        : r.STATUS === "Expiry"
        ? "warning"
        : r.STATUS === "Pending"
        ? "info"
        : "default"
    }
    size="small"
    sx={{
      fontWeight: "bold",
      color:
        r.STATUS === "Renew"
          ? "#fff"
          : r.STATUS === "Expired"
          ? "#fff"
          : r.STATUS === "Expiry"
          ? "#000"
          : "#fff",
    }}
  />
</TableCell>
                  <TableCell align="center">
  <Stack direction="row" spacing={1} justifyContent="center">
    <Button
      variant="contained"
      color="info"
      size="small"
      onClick={() => handleView(r)}
    >
      👁️ View
    </Button>

    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={() => handleUpdate(r)}
    >
      ✏️ Update
    </Button>

    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={() => handleDelete(r.ID)}
    >
      🗑️ Delete
    </Button>

    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={(e) => handleMenuOpen(e, r)}
    >
      🖨️ Print
    </Button>
  </Stack>
</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={filteredRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* PRINT MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={() => handlePrint("application")}>Application</MenuItem>
        <MenuItem onClick={() => handlePrint("certification")}>Certification</MenuItem>
        <MenuItem onClick={() => handlePrint("order")}>Order</MenuItem>
        <MenuItem onClick={() => handlePrint("pnp")}>PNP Clearance</MenuItem>
      </Menu>

      <BPLODialogPopupTOTAL
        open={openTotalRevenue}
        onClose={handleCloseTOTALRevenue}
      />

      <BPLODialogPopupREGISTERED
        open={openTotalRegistered}
        onClose={handleCloseTotalRegistered}
      />

      <BPLODialogPopupRENEW
        open={openTotalRenew}
        onClose={handleCloseTotalRenew}
      />

      <BPLODialogPopupEXPIRY
        open={openTotalExpiry}
        onClose={handleCloseTotalExpiry}
      />

      <BPLODialogPopupEXPIRE
        open={openTotalExpire}
        onClose={handleCloseTotalExpire}
      />

      {/* ✅ DIALOG FORM */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editData ? "✏️ Edit BPLO Franchise Entry" : "📝 New BPLO Franchise Entry"}
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* ✅ Pass editData to the form */}
          <BploForm editData={editData} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default FrontPage;
