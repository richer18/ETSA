import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import { MdSummarize } from "react-icons/md";
import EntryPopupDialog from "./components/entry/component/EntryPopupDialog";
import RegisterPopupDialog from "./components/register/component/RegisterPopupDialog";
import TicketPopupDialog from "./components/tickets/component/TicketPopupDialog";

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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  fontWeight: "bold",
  textAlign: "center",
  background: "linear-gradient(135deg, #1976d2, #63a4ff)",
  color: theme.palette.common.white,
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  fontSize: 14,
}));

function Index() {
  const [showFilters, setShowFilters] = useState(true);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  const [openEntryDialog, setOpenEntryDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);

  const handleClickOpenNewEntry = () => {
    setOpenEntryDialog(true);
  };

  const handleEntryClose = () => {
    setOpenEntryDialog(false);
  };

  const handleClickOpenRegister = () => {
    setOpenRegisterDialog(true);
  };

  const handleRegisterClose = () => {
    setOpenRegisterDialog(false);
  };

  const handleClickOpenTicket = () => {
    setOpenTicketDialog(true);
  };

  const handleTicketClose = () => {
    setOpenTicketDialog(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        minHeight: "100vh",
      }}
    >
      <Typography>WATER WORKS DEPARTMENT</Typography>

      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={3} sx={{ py: 2 }}>
          {showFilters && (
            <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Records"
                placeholder="Name or Receipt Number"
                // value={pendingSearchQuery}
                // onChange={(e) => setPendingSearchQuery(e.target.value)}
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
                  //   onClick={handleSearchClick}
                >
                  Apply Filters
                </Button>

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
                  //   onClick={handleSearchClick}
                >
                  Settings
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Modern Action Buttons Row */}
        <Box display="flex" alignItems="center" gap={2} sx={{ py: 1 }}>
          {/* Primary Actions Group */}
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
                onClick={handleClickOpenNewEntry}
              >
                New Entry
              </Button>
            </Tooltip>

            {/* Register New Account */}
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
                onClick={handleClickOpenRegister}
              >
                Register
              </Button>
            </Tooltip>

            {/* Ticket Management */}
            <Tooltip title="Generate Receipt Report" arrow>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ReceiptIcon size={16} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#0F7962FF",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#33C0A1FF",
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
                onClick={handleClickOpenTicket}
              >
                Ticket
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
                //   onClick={toggleDailyTable}
              >
                Daily Report
              </Button>
            </Tooltip>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            gap={4}
            justifyContent="flex-start"
          >
            {/* Barangay Shares */}
            <Tooltip title="Barangay Sharing Reports" arrow>
              <Button
                variant="contained"
                startIcon={<MdSummarize size={18} />}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  backgroundColor: "success.main",
                  color: "#fff",
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "success.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Water Billing
              </Button>
            </Tooltip>

            {/* Summary Report */}
            <Tooltip title="Summary Reports" arrow>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon fontSize="small" />}
                //   onClick={toggleSummaryTable}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  backgroundColor: "warning.main",
                  color: "#fff",
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "warning.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Water Card
              </Button>
            </Tooltip>

            {/* Financial Report */}
            <Tooltip title="Financial Reports" arrow>
              <Button
                variant="contained"
                color="error"
                startIcon={<BiSolidReport size={18} />}
                //   onClick={toggleReportTable}
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
                Ticket Status
              </Button>
            </Tooltip>

            {/* Download */}
            <Tooltip title="Export Data" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<IoMdDownload size={18} />}
                //   onClick={handleDownload}
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

        {/* Enhanced Summary Cards */}
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
              //   value: total,
              text: "Water Billing",
              //   icon: <AccountBalanceIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #3f51b5, #5c6bc0)",
            },
            {
              //   value: shareTotal,
              text: "Tickets",
              //   icon: <PieChartIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #4caf50, #66bb6a)",
            },
            {
              //   value: gfTotal,
              text: "Water Cards",
              //   icon: <AccountTreeIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #ff9800, #ffa726)",
            },
            {
              //   value: sefTotal,
              text: "Exports",
              //   icon: <SchoolIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #e91e63, #ec407a)",
            },
          ].map(({ value, text, icon, gradient }) => (
            <Card
              key={text}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: "16px",
                background: gradient,
                color: "white",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                cursor: "pointer",
                minWidth: 0, // Prevent overflow
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1.5,
                }}
              >
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
                      width: "70%", // You can make this dynamic based on your data
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
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="right">Name of Taxpayer</StyledTableCell>
              <StyledTableCell align="right">Receipt No</StyledTableCell>
              <StyledTableCell align="right">Bill ID</StyledTableCell>
              <StyledTableCell align="right">Amout</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EntryPopupDialog open={openEntryDialog} handleClose={handleEntryClose} />
      <RegisterPopupDialog
        open={openRegisterDialog}
        handleClose={handleRegisterClose}
      />

      <TicketPopupDialog
        open={openTicketDialog}
        handleClose={handleTicketClose}
      />
    </Box>
  );
}

export default Index;
