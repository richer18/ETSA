import {
  Add,
  AttachMoney,
  Autorenew,
  Business,
  Cancel,
  CheckCircle,
  Download,
  FilterList,
  Groups,
  MoreVert,
  NewReleases,
  Pending,
  Search,
  Warning,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import ModalBusiness from "./components/Modal";
// Modern color palette
const colors = {
  primary: "#4361ee",
  secondary: "#3f37c9",
  success: "#4cc9f0",
  warning: "#f8961e",
  error: "#f72585",
  dark: "#212529",
  light: "#f8f9fa",
};

// Sample data with modern business types
const registrations = [
  {
    id: "REG-2023-0015",
    name: "Nexus Analytics",
    avatar: "NA",
    type: "LLC",
    category: "Data Science",
    status: "approved",
    date: "2023-06-15",
    fee: "$1,200",
    progress: 100,
    members: 5,
  },
  {
    id: "REG-2023-0016",
    name: "Green Earth Solutions",
    avatar: "GE",
    type: "Corporation",
    category: "Sustainability",
    status: "pending",
    date: "2023-06-18",
    fee: "$2,500",
    progress: 65,
    members: 12,
  },
  {
    id: "REG-2023-0017",
    name: "Urban Bites",
    avatar: "UB",
    type: "Partnership",
    category: "Food Tech",
    status: "approved",
    date: "2023-06-20",
    fee: "$800",
    progress: 100,
    members: 2,
  },
  {
    id: "REG-2023-0018",
    name: "CloudForge",
    avatar: "CF",
    type: "C-Corp",
    category: "Cloud Computing",
    status: "rejected",
    date: "2023-06-22",
    fee: "$3,000",
    progress: 30,
    members: 8,
  },
  {
    id: "REG-2023-0019",
    name: "Mindful Spaces",
    avatar: "MS",
    type: "LLC",
    category: "Wellness",
    status: "approved",
    date: "2023-06-25",
    fee: "$950",
    progress: 100,
    members: 3,
  },
];

const statusIcons = {
  approved: <CheckCircle fontSize="small" color="success" />,
  pending: <Pending fontSize="small" color="warning" />,
  rejected: <Cancel fontSize="small" color="error" />,
};

const statusColors = {
  approved: colors.success,
  pending: colors.warning,
  rejected: colors.error,
};

const BusinessRegistrationDashboard = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tabValue, setTabValue] = useState("all");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredData = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (tabValue === "all") return matchesSearch;
    return reg.status === tabValue && matchesSearch;
  });

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: colors.light,
        minHeight: "100vh",
      }}
    >
      {/* Header with modern gradient */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: "white",
          boxShadow: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Business Registry Portal
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage and track all business registration applications
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              mt: { xs: 2, md: 0 },
              bgcolor: "white",
              color: colors.primary,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: 2,
              "&:hover": {
                bgcolor: "#f0f0f0",
                boxShadow: 4,
              },
            }}
          >
            New Registration
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards - Modern Layout */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        sx={{
          mt: 2,
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "flex-start",
        }}
      >
        {[
          {
            title: "Total Registered",
            value: "1,248",
            icon: <Business fontSize="large" />,
            color: "#1976d2",
            gradient: "linear-gradient(135deg, #1976d2, #63a4ff)",
            onClick: () => console.log("Navigating to Total Registered"),
          },
          {
            title: "Renewals",
            value: "892",
            icon: <Autorenew fontSize="large" />,
            color: "#9c27b0",
            gradient: "linear-gradient(135deg, #9c27b0, #ce93d8)",
            onClick: () => console.log("Navigating to Renewals"),
          },
          {
            title: "New Registrations",
            value: "356",
            icon: <NewReleases fontSize="large" />,
            color: "#4caf50",
            gradient: "linear-gradient(135deg, #4caf50, #81c784)",
            onClick: () => console.log("Navigating to New Registrations"),
          },
          {
            title: "Expiring Soon",
            value: "128",
            icon: <Warning fontSize="large" />,
            color: "#ff9800",
            gradient: "linear-gradient(135deg, #ff9800, #ffcc80)",
            onClick: () => console.log("Navigating to Expiring Soon"),
          },
          {
            title: "Closed Businesses",
            value: "42",
            icon: <Cancel fontSize="large" />,
            color: "#f44336",
            gradient: "linear-gradient(135deg, #f44336, #ef9a9a)",
            onClick: () => console.log("Navigating to Closed Businesses"),
          },
          {
            title: "Revenue Collected",
            value: "₱1.84M",
            icon: <AttachMoney fontSize="large" />,
            color: "#2e7d32",
            gradient: "linear-gradient(135deg, #2e7d32, #81c784)",
            onClick: () => console.log("Navigating to Revenue Collected"),
          },
        ].map((stat, index) => (
          <Box
            key={index}
            onClick={stat.onClick}
            sx={{
              flex: "1 1 220px",
              minWidth: "220px",
              p: 4,
              borderRadius: 5,
              background: stat.gradient,
              color: "#fff",
              boxShadow: `0 10px 30px ${stat.color}60`,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.35s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-6px) scale(1.02)",
                boxShadow: `0 18px 36px ${stat.color}80`,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                width: "140%",
                height: "140%",
                top: "-20%",
                left: "-20%",
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.06), transparent)",
                zIndex: 0,
              },
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                zIndex: 1,
              }}
            >
              <Box sx={{ color: "#fff" }}>{stat.icon}</Box>
            </Box>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ zIndex: 1, lineHeight: 1.2 }}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                opacity: 0.9,
                zIndex: 1,
                mt: 0.5,
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              {stat.title}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Search and Filters - Modern Layout */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2, mt: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />
          <Stack direction="row" spacing={2} width={{ xs: "100%", md: "auto" }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
              }}
            >
              Filters
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                bgcolor: "#212529",
                "&:hover": {
                  bgcolor: "#343a40",
                },
              }}
            >
              Export
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Tabs - Modern Design */}
      <Box
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: theme.palette.divider,
            zIndex: -1,
          },
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-indicator": {
              height: "3px",
              backgroundColor: theme.palette.primary.main,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              minHeight: "48px",
              color: theme.palette.text.secondary,
              padding: "0 16px",
              minWidth: "auto",
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
              "&:hover": {
                color: theme.palette.primary.dark,
                backgroundColor: "rgba(0, 0, 0, 0.03)",
              },
            },
          }}
        >
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>All Businesses</Typography>
                <Chip
                  label="20"
                  size="small"
                  sx={{
                    height: "20px",
                    fontSize: "0.65rem",
                    bgcolor: "rgba(0, 0, 0, 0.08)",
                  }}
                />
              </Stack>
            }
            value="all"
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle fontSize="small" color="success" />
                <Typography>Approved</Typography>
                <Chip
                  label="12"
                  size="small"
                  sx={{
                    height: "20px",
                    fontSize: "0.65rem",
                    bgcolor: "rgba(76, 201, 240, 0.1)",
                    color: theme.palette.success.main,
                  }}
                />
              </Stack>
            }
            value="approved"
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Pending fontSize="small" color="warning" />
                <Typography>Pending</Typography>
                <Chip
                  label="5"
                  size="small"
                  sx={{
                    height: "20px",
                    fontSize: "0.65rem",
                    bgcolor: "rgba(248, 150, 30, 0.1)",
                    color: theme.palette.warning.main,
                  }}
                />
              </Stack>
            }
            value="pending"
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Cancel fontSize="small" color="error" />
                <Typography>Rejected</Typography>
                <Chip
                  label="3"
                  size="small"
                  sx={{
                    height: "20px",
                    fontSize: "0.65rem",
                    bgcolor: "rgba(247, 37, 133, 0.1)",
                    color: theme.palette.error.main,
                  }}
                />
              </Stack>
            }
            value="rejected"
          />
        </Tabs>
      </Box>
      {/* Table - Modern Design */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: colors.light }}>
                <TableCell sx={{ fontWeight: 700 }}>Business</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Members</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:last-child td": { border: 0 },
                    "&:hover": { bgcolor: "#f5f7fa" },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: statusColors[row.status],
                          width: 40,
                          height: 40,
                          fontWeight: 600,
                        }}
                      >
                        {row.avatar}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.type}
                      size="small"
                      sx={{
                        bgcolor: `${colors.primary}10`,
                        color: colors.primary,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{row.category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Groups color="action" fontSize="small" />
                      <Typography>{row.members}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: "100%", minWidth: 100 }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: `${colors.primary}20`,
                          "& .MuiLinearProgress-bar": {
                            bgcolor:
                              row.progress === 100
                                ? colors.success
                                : colors.primary,
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {row.progress}% complete
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      icon={statusIcons[row.status]}
                      sx={{
                        bgcolor: `${statusColors[row.status]}10`,
                        color: statusColors[row.status],
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        setMenuAnchor(e.currentTarget);
                        setSelectedRow(row);
                      }}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </Card>

      {/* Context Menu - Modern Design */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            py: 0,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ py: 1.5 }}>
          <Typography variant="body2">View Taxpayer Card</Typography>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ py: 1.5 }}>
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ py: 1.5 }}>
          <Typography variant="body2">Edit Registration</Typography>
        </MenuItem>
        <Divider sx={{ my: 0 }} />
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ py: 1.5 }}>
          <Typography variant="body2">Generate Certificate</Typography>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ py: 1.5 }}>
          <Typography variant="body2">Download Documents</Typography>
        </MenuItem>
        <Divider sx={{ my: 0 }} />
        <MenuItem
          onClick={() => setMenuAnchor(null)}
          sx={{ py: 1.5, color: colors.error }}
        >
          <Typography variant="body2">Cancel Registration</Typography>
        </MenuItem>
      </Menu>

      {isModalOpen && <ModalBusiness onClose={() => setIsModalOpen(false)} />}
    </Box>
  );
};

export default BusinessRegistrationDashboard;
