import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BarChartIcon from "@mui/icons-material/BarChart";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import DirectionsTransitFilledIcon from "@mui/icons-material/DirectionsTransitFilled";
import ElectricScooterIcon from "@mui/icons-material/ElectricScooter";
import EmailIcon from "@mui/icons-material/Email";
import GavelIcon from "@mui/icons-material/Gavel";
import HouseIcon from "@mui/icons-material/House";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import InboxIcon from "@mui/icons-material/Inbox";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ScubaDivingIcon from "@mui/icons-material/ScubaDiving";
import SellIcon from "@mui/icons-material/Sell";
import SendIcon from "@mui/icons-material/Send";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { createTheme, styled } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";
import PropTypes from "prop-types";
import * as React from "react";
import axiosInstance from "../../api/axiosInstance";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TaxCollected from "./components/CHARTS/TaxCollected";
import CedulaCollected from "./components/CHARTS/CedulaCollected";
// import GeneralFundCollected from "./components/CHARTS/GeneralFundCollected";
import "./system.css";
// import TrustFundCollected from "./components/CHARTS/TrustFundCollected";
// import RealPropertyTaxCollected from "./components/CHARTS/RealPropertyTaxCollected";
// import Status from "./components/CHARTS/status";

const NAVIGATION = [
  {
    kind: "header",
    title: "Core Operations",
  },
  {
    segment: "my-app",
    title: "Dashboard",
    icon: <DashboardIcon sx={{ color: "primary.main" }} />,
  },
  {
    segment: "rcd",
    title: "Report of Collection and Deposit",
    icon: <AssignmentIcon sx={{ color: "primary.main" }} />,
  },
  {
    segment: "calendar",
    title: "Calendar",
    icon: <CalendarMonthIcon sx={{ color: "primary.main" }} />,
  },
  {
    title: "Abstract",
    icon: <ArticleIcon sx={{ color: "secondary.main" }} />,
    children: [
      {
        segment: "Real-Property-Tax",
        title: "Real Property Tax",
        icon: <HouseIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "General-Fund",
        title: "General Fund",
        icon: <AccountBalanceWalletIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "Trust-Fund",
        title: "Trust Fund",
        icon: <GavelIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "community-tax-certificate",
        title: "Community Tax Certificate",
        icon: <AssignmentIndIcon sx={{ color: "warning.main" }} />,
      },
    ],
  },
  {
    title: "Business",
    icon: <BusinessIcon sx={{ color: "warning.main" }} />,
    children: [
      {
        segment: "business-registration",
        title: "Business Registration",
        icon: <HowToRegIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "mch",
        title: "MCH FRANCHISE",
        icon: <DirectionsTransitFilledIcon sx={{ color: "warning.main" }} />,
      },
      {
        segment: "e-bike-trisikad",
        title: "E_BIKE-TRISIKAD",
        icon: <ElectricScooterIcon sx={{ color: "info.main" }} />,
      },
    ],
  },
  {
    title: "Tickets",
    icon: <BookOnlineIcon sx={{ color: "info.main" }} />,
    children: [
      {
        segment: "dive-ticket",
        title: "Diving Ticket",
        icon: <ScubaDivingIcon sx={{ color: "info.dark" }} />,
      },
      {
        segment: "cash-ticket",
        title: "Cash Ticket",
        icon: <SellIcon sx={{ color: "secondary.main" }} />,
      },
    ],
  },
  {
    segment: "doc-stamp",
    title: "Doc Stamp",
    icon: <AssignmentIcon sx={{ color: "primary.main" }} />,
  },
  {
    segment: "water-works",
    title: "Water Works",
    icon: <WaterDropIcon sx={{ color: "info.main" }} />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Administration",
  },
  {
    segment: "import",
    title: "Import Data",
    icon: <ImportExportIcon sx={{ color: "info.main" }} />,
    children: [
      {
        segment: "import-general-fund",
        title: "General Fund",
        icon: <AccountBalanceWalletIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "import-trust-fund",
        title: "Trust Fund",
        icon: <GavelIcon sx={{ color: "warning.main" }} />,
      },
      {
        segment: "import-real-property-tax",
        title: "Real Property Tax",
        icon: <HouseIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "import-cedula",
        title: "Cedula",
        icon: <AssignmentIndIcon sx={{ color: "info.main" }} />,
      },
    ],
  },
  {
    segment: "template",
    title: "Templates",
    icon: <DescriptionIcon sx={{ color: "info.main" }} />,
    children: [
      {
        segment: "email-inbox",
        title: "Voucher",
        icon: <AssignmentIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "email-sent",
        title: "RCD GF",
        icon: <ArticleIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "email-sent",
        title: "RCD SEF",
        icon: <BookOnlineIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH Application",
        icon: <DirectionsTransitFilledIcon sx={{ color: "warning.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH Certification",
        icon: <HowToRegIcon sx={{ color: "info.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH Order",
        icon: <SellIcon sx={{ color: "secondary.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH Clearance",
        icon: <GavelIcon sx={{ color: "primary.main" }} />,
      },
    ],
  },
  {
    segment: "email",
    title: "Email",
    icon: <EmailIcon sx={{ color: "error.main" }} />,
    children: [
      {
        segment: "email-inbox",
        title: "Inbox",
        icon: <InboxIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "email-sent",
        title: "Sent",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
    ],
  },
  {
    segment: "income-target",
    title: "Income Target",
    icon: <TrendingUpIcon sx={{ color: "success.dark" }} />,
  },
  {
    segment: "register-user",
    title: "User Registration",
    icon: <AppRegistrationIcon sx={{ color: "info.main" }} />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    title: "Reports",
    icon: <BarChartIcon sx={{ color: "primary.main" }} />,
    children: [
      {
        segment: "business-card",
        title: "Business Card",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "rpt-card",
        title: "RPT Card",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "full-report",
        title: "Full Report",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "rcd",
        title: "RCD",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "esre",
        title: "ESRE",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "collection",
        title: "Summary of Collection Report",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const breadcrumbItems = pathname.split("/").filter(Boolean);

  const isDashboard = pathname === "/my-app" || pathname === "/";
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="#">
            Home
          </Link>
          {breadcrumbItems.map((item, index) => (
            <Link
              key={item}
              color={
                breadcrumbItems[breadcrumbItems.length - 1] === item
                  ? "text.primary"
                  : "inherit"
              }
              href={`/${breadcrumbItems.slice(0, index + 1).join("/")}`}
              aria-current={
                breadcrumbItems[breadcrumbItems.length - 1] === item
                  ? "page"
                  : undefined
              }
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>

      <Box sx={{ textAlign: "center", flexGrow: 1 }}>
        {isDashboard ? <DashboardHome /> : <Outlet />}
      </Box>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = `/my-app${location.pathname.startsWith("/my-app") ? location.pathname.slice(7) : location.pathname}`;

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => {
        const fullPath = path.startsWith("/my-app") ? path : `/my-app${path}`;
        console.log(`Navigating to: ${fullPath}`);
        navigate(fullPath);
      },
    }),
    [pathname, navigate, location.search]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // Remove this provider when copying and pasting into your project.
    <DemoProvider window={demoWindow}>
      {/* preview-start */}
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <img src="/assets/images/ZAMBO_LOGO_P.png" alt="LGU logo" />,
          title: "ETMS",
          // homeUrl: "/toolpad/core/introduction",
        }}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
      {/* preview-end */}
    </DemoProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function DashboardCard({ title, subtitle, value, loading, children }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 10px 24px rgba(12, 35, 64, 0.08)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <div>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </div>
          <div>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="h6">{value}</Typography>
            )}
          </div>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function DashboardHomeLegacy() {
  const [showFilter, setShowFilter] = React.useState(false);
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState({ totalThisMonth: 0, totalThisYear: 0, businessCount: 0 });

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

  const computeStats = (rows, selMonth, selYear) => {
    const monthIndex = Number(selMonth) - 1;
    let totalThisMonth = 0;
    let totalThisYear = 0;
    const businesses = new Set();

    rows.forEach((r) => {
      const d = r.date ? new Date(r.date) : null;
      const amount = Number(r.totalCollection || r.total || r.amount || 0) || 0;
      if (d) {
        if (d.getMonth() === monthIndex && d.getFullYear() === Number(selYear)) {
          totalThisMonth += amount;
        }
        if (d.getFullYear() === Number(selYear)) {
          totalThisYear += amount;
        }
      }
      // attempt to capture payer/business name fields if available
      if (r.name) businesses.add(r.name);
      if (r.business_name) businesses.add(r.business_name);
      if (r.business) businesses.add(r.business);
    });

    return { totalThisMonth, totalThisYear, businessCount: businesses.size };
  };

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const resp = await axiosInstance.get("fetch-report");
      const rows = Array.isArray(resp.data) ? resp.data : [];
      setData(rows);
      const s = computeStats(rows, month, year);
      setStats(s);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
      setData([]);
      setStats({ totalThisMonth: 0, totalThisYear: 0, businessCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApplyFilter = () => {
    fetchData();
    setShowFilter(false);
  };

  const exportCsv = () => {
    // fallback: export current data filtered by month/year
    const monthIndex = Number(month) - 1;
    const rows = data.filter((r) => {
      const d = r.date ? new Date(r.date) : null;
      if (!d) return false;
      return d.getMonth() === monthIndex && d.getFullYear() === Number(year);
    });
    const headers = Object.keys(rows[0] || {}).filter(Boolean);
    const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(",")]
      .concat(rows.map((r) => headers.map((h) => escape(r[h])).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_export_${year}_${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Treasurer's Dashboard</h1>
          <p>Municipal Treasurer Office • As of 2025</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="filter-btn"
            onClick={() => setShowFilter((s) => !s)}
            aria-expanded={showFilter}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
            </svg>
            Filter Period
          </button>
          <button type="button" className="export-btn" onClick={exportCsv}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>
            Export Reports
          </button>
        </div>
      </header>

      {showFilter && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <FormControl size="small">
            <InputLabel id="month-label">Month</InputLabel>
            <Select
              labelId="month-label"
              value={month}
              label="Month"
              onChange={(e) => setMonth(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              {months.map((m, i) => (
                <MenuItem key={m} value={i + 1}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
              sx={{ minWidth: 100 }}
            >
              {Array.from({ length: 6 }).map((_, idx) => {
                const y = new Date().getFullYear() - idx;
                return (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Button variant="contained" size="small" onClick={handleApplyFilter}>
            Apply
          </Button>
          <Button variant="outlined" size="small" onClick={() => { setShowFilter(false); }}>
            Close
          </Button>
        </Box>
      )}

      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TaxCollected />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <CedulaCollected />
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            {/* <GeneralFundCollected/> */}
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            {/* <TrustFundCollected/> */}
          </Grid>
          
          <Grid item xs={12} md={6} lg={2}>
            {/* <RealPropertyTaxCollected/> */}
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            {/* <Status/> */}
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            <DashboardCard
              title="Business Count"
              subtitle="Active registrations"
              value={stats.businessCount}
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={6}>
            <Item>
              <Typography variant="subtitle1">Status</Typography>
              <Typography variant="body2" color="text.secondary">
                Collection status and recent alerts will appear here. Click a card to drill down.
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

function DashboardHome() {
  const [showFilter, setShowFilter] = React.useState(false);
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const resp = await axiosInstance.get("fetch-report");
      const rows = Array.isArray(resp.data) ? resp.data : [];
      setData(rows);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApplyFilter = () => {
    fetchData();
    setShowFilter(false);
  };

  const exportCsv = () => {
    const monthIndex = Number(month) - 1;
    const rows = data.filter((r) => {
      const d = r.date ? new Date(r.date) : null;
      if (!d) return false;
      return d.getMonth() === monthIndex && d.getFullYear() === Number(year);
    });
    const headers = Object.keys(rows[0] || {}).filter(Boolean);
    const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(",")]
      .concat(rows.map((r) => headers.map((h) => escape(r[h])).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_export_${year}_${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ px: { xs: 0.5, md: 1 }, pb: 2 }}>
      <Paper
        sx={{
          mb: 2,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(20,41,109,0.98) 0%, rgba(26,82,173,0.95) 55%, rgba(19,127,140,0.92) 100%)",
          color: "white",
          boxShadow: "0 18px 36px rgba(9, 30, 66, 0.28)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              Treasurer's Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.8 }}>
              Municipal Treasury Operations Overview, {year}
            </Typography>
            <Box sx={{ mt: 1.6, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={`Month: ${months[month - 1]}`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "white" }}
              />
              <Chip
                label={`Year: ${year}`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "white" }}
              />
              <Chip
                label={loading ? "Syncing..." : "Data Ready"}
                size="small"
                sx={{
                  bgcolor: loading ? "rgba(255,193,7,0.25)" : "rgba(76,175,80,0.25)",
                  color: "white",
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => setShowFilter((s) => !s)}
              sx={{
                bgcolor: "rgba(255,255,255,0.16)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
              }}
            >
              Filter Period
            </Button>
            <Button
              variant="outlined"
              onClick={exportCsv}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.55)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Export Reports
            </Button>
          </Box>
        </Box>
      </Paper>

      {showFilter && (
        <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <FormControl size="small">
              <InputLabel id="month-label">Month</InputLabel>
              <Select
                labelId="month-label"
                value={month}
                label="Month"
                onChange={(e) => setMonth(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                {months.map((m, i) => (
                  <MenuItem key={m} value={i + 1}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="year-label">Year</InputLabel>
              <Select
                labelId="year-label"
                value={year}
                label="Year"
                onChange={(e) => setYear(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                {Array.from({ length: 8 }).map((_, idx) => {
                  const y = new Date().getFullYear() - idx;
                  return (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Button variant="contained" onClick={handleApplyFilter}>
              Apply
            </Button>
            <Button variant="text" onClick={() => setShowFilter(false)}>
              Close
            </Button>
          </Box>
        </Paper>
      )}

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 10 }} />}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TaxCollected />
        </Grid>
        <Grid item xs={12} md={6}>
          <CedulaCollected />
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "left",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.8 }}>
              Quick Notes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use the month and year filter to align chart summaries and export the same reporting
              slice. This panel can be extended for alerts such as missed remittances, low
              collection days, or pending approvals.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardLayoutBranding;
