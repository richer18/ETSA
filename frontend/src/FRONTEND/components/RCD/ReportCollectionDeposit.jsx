import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
Alert,
Autocomplete,
Box,
Button,
Card,
Chip,
Dialog,
DialogActions,
DialogContent,
DialogContentText,
DialogTitle,
IconButton,
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
// import axios from "axios";
import { saveAs } from "file-saver"; // npm install file-saver
import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import axiosInstance from "../../../api/axiosInstance";
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload, IoMdPrint } from "react-icons/io";
import { IoToday } from "react-icons/io5";
// import * as XLSX from "xlsx"; // npm install xlsx

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GavelIcon from "@mui/icons-material/Gavel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CheckStocks from "./components/CheckStocks";
import DailyReport from "./components/DailyReport";
import AssignAccountableForms from "./components/AssignAccountableForms";
import Inventory from "./components/Inventory";
import IssueForm from "./components/IssueForm";
import Logs from "./components/Logs";
import NewEntryForm from "./components/NewEntryForm";
import PurchaseForm from "./components/PurchaseForm";
import RcdPrintTable from "./components/RcdPrintTable";

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

function ReportCollectionDeposit() {
    // Dialog states
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [dialogContent, setDialogContent] = useState(null);
      const [dialogTitle, setDialogTitle] = useState("");
    
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
      const [activeSection, setActiveSection] = useState("main");
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
      const [openPrintPreview, setOpenPrintPreview] = useState(false);
      const [printPayload, setPrintPayload] = useState(null);
      const printPreviewRef = useRef(null);
      const [openPrintSelector, setOpenPrintSelector] = useState(false);
      const [printCollector, setPrintCollector] = useState("");
      const [printDate, setPrintDate] = useState("");

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

  const fetchEntries = async () => {
    try {
      const response = await axiosInstance.get("/rcd-entries", {
        params: {
          month,
          year,
          search: searchQuery || undefined,
        },
      });
      const rowsFromApi = Array.isArray(response.data) ? response.data : [];
      setFilteredData(rowsFromApi);
    } catch (error) {
      console.error("Failed to load RCD entries:", error);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [month, year, searchQuery]);

  const getRowId = (row) => row?.id ?? row?.ID ?? null;

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDialogContent(null);
    setDialogTitle("");
  };

  const handleOpenPurchaseForm = () => {
    setDialogTitle("Purchase Form");
    setDialogContent(<PurchaseForm />);
    setIsDialogOpen(true);
  };

  const handleOpenAssignForm = () => {
    setDialogTitle("Assign Accountable Form");
    setDialogContent(<AssignAccountableForms />);
    setIsDialogOpen(true);
  };

  // TOTAL POPUP
  const handleClickTotal = () => {
    setOpenTOTAL(true);
  };
//   const handleCloseTOTAL = () => {
//     setOpenTOTAL(false);
//   };
  const handleClickTax = () => {
    setOpenTax(true);
  };
//   const handleCloseTax = () => {
//     setOpenTax(false);
//   };
  const handleClickRF = () => {
    setOpenRf(true);
  };
//   const handleCloseRF = () => {
//     // Fixed name
//     setOpenRf(false);
//   };
  const handleClickSUC = () => {
    setOpenSUC(true);
  };
//   const handleCloseSUC = () => {
//     setOpenSUC(false);
//   };
  const handleClickRFEE = () => {
    setOpenRFEE(true);
  };
//   const handleCloseRFEE = () => {
//     setOpenRFEE(false);
//   };

  // Daily table popup
//   const handleCloseDailyTable = () => {
//     setOpenDailyTable(false);
//   };

  // Table pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

  // Toggle sub-tables
  const showSection = (section) => {
    setActiveSection(section);
    if (section === "daily") {
      setShowDailyTable(true);
      setShowMainTable(false);
      setShowReportTable(false);
      setShowFilters(false);
      return;
    }

    if (section === "financial") {
      setShowDailyTable(false);
      setShowMainTable(false);
      setShowReportTable(true);
      setShowFilters(false);
      return;
    }

    if (section === "check-stock" || section === "inventory" || section === "issue-form" || section === "logs") {
      setShowDailyTable(false);
      setShowMainTable(false);
      setShowReportTable(false);
      setShowFilters(false);
      return;
    }

    // main/default
    setShowDailyTable(false);
    setShowMainTable(true);
    setShowReportTable(false);
    setShowFilters(true);
  };

  const toggleReportTable = () => {
    showSection("financial");
  };

  const toggleDailyTable = () => {
    showSection("daily");
  };

  const handleNewEntryClick = () => {
    showSection("main");
    setDialogTitle("New Entry");
    setDialogContent(
      <NewEntryForm
        onSaved={() => {
          fetchEntries();
          handleCloseDialog();
        }}
        onCancel={handleCloseDialog}
      />
    );
    setIsDialogOpen(true);
  };

  const handleCheckStockClick = () => {
    showSection("check-stock");
  };

  const handleInventoryClick = () => {
    showSection("inventory");
  };

  const handleIssueFormClick = () => {
    showSection("issue-form");
  };

  const handleLogsClick = () => {
    showSection("logs");
  };

  const handleBackToMainTable = () => {
    showSection("main");
  };

  // “Download” logic
  const getCollectorFromRow = (row) => row?.Collector || row?.collector || "";
  const getDateFromRow = (row) => row?.issued_date || row?.Date || row?.date || "";

  const handleViewClick = () => {
    if (!selectedRow) return;

    const rowDate = selectedRow.issued_date || selectedRow.Date || selectedRow.date || "-";
    const collector = selectedRow.Collector || selectedRow.collector || "-";
    const receiptType = selectedRow.Type_Of_Receipt || selectedRow.type_of_receipt || "-";
    const receiptFrom = selectedRow.Receipt_No_From || selectedRow.receipt_no_from || "-";
    const receiptTo = selectedRow.Receipt_No_To || selectedRow.receipt_no_to || "-";
    const total = Number(selectedRow.Total || selectedRow.total || 0);
    const status = selectedRow.Status || selectedRow.status || "Not Remit";

    setDialogTitle("View Entry");
    setDialogContent(
      <Box sx={{ display: "grid", gap: 1.25, py: 1 }}>
        <Typography><strong>Date:</strong> {formatDate(rowDate)}</Typography>
        <Typography><strong>Collector:</strong> {collector}</Typography>
        <Typography><strong>Type of Receipt:</strong> {receiptType}</Typography>
        <Typography><strong>Receipt No. From:</strong> {receiptFrom}</Typography>
        <Typography><strong>Receipt No. To:</strong> {receiptTo}</Typography>
        <Typography>
          <strong>Total:</strong>{" "}
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
          }).format(total)}
        </Typography>
        <Typography><strong>Status:</strong> {status}</Typography>
      </Box>
    );
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleEditClick = () => {
    if (!selectedRow) return;
    setSnackbar({
      open: true,
      message: "Update action is ready for wiring to your update form.",
      severity: "info",
    });
    handleMenuClose();
  };

  const toInt = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const toDateKey = (value) => {
    if (!value) return "";
    if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const sameCollector = (entryCollector, targetCollector) =>
    String(entryCollector || "").trim().toLowerCase() === String(targetCollector || "").trim().toLowerCase();

  const sameType = (entryType, targetType) =>
    String(entryType || "").trim().toLowerCase() === String(targetType || "").trim().toLowerCase();

  const issuedQtyFromEntry = (entry) => {
    const from = toInt(entry?.receipt_no_from ?? entry?.Receipt_No_From);
    const to = toInt(entry?.receipt_no_to ?? entry?.Receipt_No_To);
    return to >= from && from > 0 ? to - from + 1 : 0;
  };

  const buildAccountabilityRows = ({ collector, targetDateKey, issuedForms, collectorEntries }) => {
    const relevantForms = issuedForms.filter((form) => {
      if (!sameCollector(form?.Collector ?? form?.collector, collector)) return false;
      const status = String(form?.Status ?? form?.status ?? "").toUpperCase();
      if (status && status !== "ISSUED") return false;
      const assignDateKey = toDateKey(form?.Date ?? form?.Date_Issued ?? form?.date ?? form?.date_issued);
      return !assignDateKey || assignDateKey <= targetDateKey;
    });

    const latestByType = new Map();
    for (const form of relevantForms) {
      const type = String(form?.Form_Type ?? form?.form_type ?? "").trim();
      if (!type) continue;
      const currentKey = toDateKey(form?.Date ?? form?.Date_Issued ?? form?.date ?? form?.date_issued);
      const existing = latestByType.get(type);
      if (!existing) {
        latestByType.set(type, form);
        continue;
      }
      const existingKey = toDateKey(existing?.Date ?? existing?.Date_Issued ?? existing?.date ?? existing?.date_issued);
      if (currentKey >= existingKey) {
        latestByType.set(type, form);
      }
    }

    const rows = [];
    latestByType.forEach((form, type) => {
      const assignDateKey = toDateKey(form?.Date ?? form?.Date_Issued ?? form?.date ?? form?.date_issued);
      const initialQty = toInt(
        form?.Begginning_Balance_receipt_qty ??
          form?.Receipt_Range_qty ??
          form?.Stock ??
          form?.stock
      );
      const initialFrom = toInt(
        form?.Begginning_Balance_receipt_from ??
          form?.Receipt_Range_From ??
          form?.receipt_range_from
      );
      const initialTo = toInt(
        form?.Begginning_Balance_receipt_to ??
          form?.Receipt_Range_To ??
          form?.receipt_range_to
      );

      const scopedEntries = collectorEntries
        .filter((entry) => sameType(entry?.type_of_receipt ?? entry?.Type_Of_Receipt, type))
        .filter((entry) => {
          const key = toDateKey(entry?.issued_date ?? entry?.Date ?? entry?.date);
          if (!key) return false;
          if (assignDateKey && key < assignDateKey) return false;
          return key <= targetDateKey;
        });

      const beforeEntries = scopedEntries.filter(
        (entry) => toDateKey(entry?.issued_date ?? entry?.Date ?? entry?.date) < targetDateKey
      );
      const todayEntries = scopedEntries.filter(
        (entry) => toDateKey(entry?.issued_date ?? entry?.Date ?? entry?.date) === targetDateKey
      );

      const cumulativeIssuedBefore = beforeEntries.reduce(
        (sum, entry) => sum + issuedQtyFromEntry(entry),
        0
      );

      const availableBefore = Math.max(initialQty - cumulativeIssuedBefore, 0);
      const nextFromBefore = availableBefore > 0 ? initialFrom + cumulativeIssuedBefore : 0;

      const isFirstUsageDay = cumulativeIssuedBefore === 0;
      const begQty = isFirstUsageDay ? availableBefore : 0;
      const begFrom = isFirstUsageDay && availableBefore > 0 ? initialFrom : 0;
      const begTo = isFirstUsageDay && availableBefore > 0 ? initialTo : 0;

      const recQty = isFirstUsageDay ? 0 : availableBefore;
      const recFrom = isFirstUsageDay || availableBefore <= 0 ? 0 : nextFromBefore;
      const recTo = isFirstUsageDay || availableBefore <= 0 ? 0 : initialTo;

      const issuedQty = todayEntries.reduce((sum, entry) => sum + issuedQtyFromEntry(entry), 0);
      const issuedFrom =
        todayEntries.length > 0
          ? Math.min(...todayEntries.map((entry) => toInt(entry?.receipt_no_from ?? entry?.Receipt_No_From)))
          : 0;
      const issuedTo =
        todayEntries.length > 0
          ? Math.max(...todayEntries.map((entry) => toInt(entry?.receipt_no_to ?? entry?.Receipt_No_To)))
          : 0;

      const endQty = Math.max(availableBefore - issuedQty, 0);
      const endFrom = endQty > 0 ? nextFromBefore + issuedQty : 0;
      const endTo = endQty > 0 ? initialTo : 0;

      if (begQty <= 0 && recQty <= 0 && issuedQty <= 0 && endQty <= 0) return;

      rows.push({
        name: type,
        begQty,
        begFrom,
        begTo,
        recQty,
        recFrom,
        recTo,
        issuedQty,
        issuedFrom,
        issuedTo,
        endQty,
        endFrom,
        endTo,
      });
    });

    return rows;
  };

  const buildPrintPayload = ({ row, issuedForms, rcdEntries }) => {
    const rowDate = row?.issued_date || row?.Date || row?.date || new Date();
    const targetDateKey = toDateKey(rowDate);
    const collector = row?.Collector || row?.collector || "";
    const dateObj = new Date(rowDate);

    const collectorEntries = (Array.isArray(rcdEntries) ? rcdEntries : []).filter((entry) =>
      sameCollector(entry?.collector ?? entry?.Collector, collector)
    );

    const sameDayEntries = collectorEntries.filter(
      (entry) => toDateKey(entry?.issued_date ?? entry?.Date ?? entry?.date) === targetDateKey
    );

    const collections = sameDayEntries.map((entry) => ({
      type: entry?.type_of_receipt ?? entry?.Type_Of_Receipt ?? "",
      from: entry?.receipt_no_from ?? entry?.Receipt_No_From ?? "",
      to: entry?.receipt_no_to ?? entry?.Receipt_No_To ?? "",
      amount: Number(entry?.total ?? entry?.Total ?? 0),
    }));

    const fallbackCollections = [
      {
        type: row?.type_of_receipt ?? row?.Type_Of_Receipt ?? "",
        from: row?.receipt_no_from ?? row?.Receipt_No_From ?? "",
        to: row?.receipt_no_to ?? row?.Receipt_No_To ?? "",
        amount: Number(row?.total ?? row?.Total ?? 0),
      },
    ].filter(
      (item) => item.type || item.from || item.to || Number(item.amount || 0) > 0
    );

    const finalCollections = collections.length > 0 ? collections : fallbackCollections;

    const totalCollections = finalCollections.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const autoAccountability = buildAccountabilityRows({
      collector,
      targetDateKey,
      issuedForms: Array.isArray(issuedForms) ? issuedForms : [],
      collectorEntries,
    });

    console.log("PRINT PAYLOAD:", {
      collector,
      targetDateKey,
      collections: finalCollections.length,
      autoAccountability: autoAccountability.length,
    });

    return {
      header: {
        municipality: "MUNICIPALITY",
        fund: "GENERAL FUND",
        officer: collector || "ACCOUNTABLE OFFICER",
        liquidatingOfficer: collector || "ACCOUNTABLE OFFICER",
        bank: "Paul Ree Ambrose A. Martinez",
        reference: "",
        treasurer: "MUNICIPAL TREASURER",
      },
      formattedDate: formatDate(rowDate),
      shortDate: Number.isNaN(dateObj.getTime()) ? "" : dateObj.toLocaleDateString("en-US"),
      collections: finalCollections,
      totalCollections,
      autoAccountability,
    };
  };

  const handlePrintNow = () => {
    if (!printPreviewRef.current) return;
    const previewElement = printPreviewRef.current.querySelector("#rcd-print-preview-root");
    const previewHtml = previewElement?.outerHTML || "";
    if (!previewHtml || !previewHtml.trim()) {
      setSnackbar({
        open: true,
        message: "Nothing to print. Please re-open Print Preview.",
        severity: "warning",
      });
      return;
    }

    const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map((node) => node.outerHTML)
      .join("\n");

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframe.contentWindow) {
      document.body.removeChild(iframe);
      setSnackbar({
        open: true,
        message: "Unable to initialize print view.",
        severity: "error",
      });
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>RCD Print Preview</title>
          ${styles}
          <style>
            @page { margin: 12mm; }
            body { margin: 0; background: #fff; color: #000; }
          </style>
        </head>
        <body>${previewHtml}</body>
      </html>
    `);
    iframeDoc.close();

    const cleanup = () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    const doPrint = () => {
      const win = iframe.contentWindow;
      if (!win) {
        cleanup();
        return;
      }
      win.focus();
      win.onafterprint = cleanup;
      setTimeout(() => {
        win.print();
      }, 400);
    };

    setTimeout(doPrint, 300);
  };

  const handleSavePdf = async () => {
    if (!printPreviewRef.current) return;
    const previewElement = printPreviewRef.current.querySelector("#rcd-print-preview-root");
    if (!previewElement) {
      setSnackbar({
        open: true,
        message: "Nothing to save. Please open Print Preview first.",
        severity: "warning",
      });
      return;
    }

    const collector = printPayload?.header?.officer || "collector";
    const datePart = (printPayload?.formattedDate || "").replace(/[^a-zA-Z0-9]+/g, "-");
    const filename = `RCD-${collector.replace(/[^a-zA-Z0-9]+/g, "-")}-${datePart || "report"}.pdf`;

    // Use a cloned node with explicit border rules so PDF borders match preview/print.
    const exportRoot = document.createElement("div");
    exportRoot.style.position = "fixed";
    exportRoot.style.left = "-100000px";
    exportRoot.style.top = "0";
    exportRoot.style.background = "#fff";
    exportRoot.style.padding = "0";
    exportRoot.style.margin = "0";

    const clonedNode = previewElement.cloneNode(true);
    const forcedBorderStyle = document.createElement("style");
    forcedBorderStyle.textContent = `
      #rcd-print-preview-root,
      #rcd-print-preview-root * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #rcd-print-preview-root .border,
      #rcd-print-preview-root .border-top,
      #rcd-print-preview-root .border-end,
      #rcd-print-preview-root .border-bottom,
      #rcd-print-preview-root .border-start,
      #rcd-print-preview-root table,
      #rcd-print-preview-root th,
      #rcd-print-preview-root td {
        border-color: #000 !important;
        border-width: 1px !important;
        border-style: solid !important;
      }
      #rcd-print-preview-root table {
        border-collapse: collapse !important;
      }
    `;
    exportRoot.appendChild(forcedBorderStyle);
    exportRoot.appendChild(clonedNode);
    document.body.appendChild(exportRoot);

    const options = {
      margin: 8,
      filename,
      image: { type: "png", quality: 1 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: "#ffffff", logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    try {
      await html2pdf().set(options).from(exportRoot).save();
      setSnackbar({
        open: true,
        message: "PDF saved successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to save PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to save PDF.",
        severity: "error",
      });
    } finally {
      if (exportRoot.parentNode) {
        exportRoot.parentNode.removeChild(exportRoot);
      }
    }
  };

  const preparePrintForRow = async (row, closeMenu = false) => {
    
  if (!row) return null;

  try {
    const [issuedFormsRes, rcdEntriesRes] = await Promise.all([
      axiosInstance.get("/issued-forms"),
      axiosInstance.get("/rcd-entries"),
    ]);

    // ✅ Safely extract data
    const issuedForms =
      issuedFormsRes?.data?.data || issuedFormsRes?.data || [];

    const rcdEntries =
      rcdEntriesRes?.data?.data || rcdEntriesRes?.data || [];

    const payload = buildPrintPayload({
      row,
      issuedForms,
      rcdEntries,
    });

    // ✅ Validate payload before showing preview
    if (!payload) {
      throw new Error("Payload build failed");
    }

    setPrintPayload(payload);
    setOpenPrintPreview(true);

    if (closeMenu) handleMenuClose();
    return payload;

  } catch (error) {
    console.error("Failed to prepare print payload:", error);

    setSnackbar({
      open: true,
      message: "Unable to load accountability data for printing.",
      severity: "error",
    });

    if (closeMenu) handleMenuClose();
    return null;
  }
};

  const handlePrintClick = async () => {
  if (!selectedRow) {
    setSnackbar({
      open: true,
      message: "Select a row first to print.",
      severity: "info",
    });
    return;
  }

  await preparePrintForRow(selectedRow, true);
};

  const handleToolbarPrintClick = () => {
    const defaultCollector = getCollectorFromRow(selectedRow) || "";
    const defaultDate = toDateKey(getDateFromRow(selectedRow)) || "";
    setPrintCollector(defaultCollector);
    setPrintDate(defaultDate);
    setOpenPrintSelector(true);
  };

  const handleConfirmToolbarPrint = async () => {
  if (!printCollector || !printDate) {
    setSnackbar({
      open: true,
      message: "Please select Date and Collector.",
      severity: "warning",
    });
    return;
  }

  const matchedRow = (filteredData || []).find((row) => {
    const collector = getCollectorFromRow(row);
    const rowDate = toDateKey(getDateFromRow(row));
    return sameCollector(collector, printCollector) && rowDate === printDate;
  });

  if (!matchedRow) {
    setSnackbar({
      open: true,
      message: "No matching record found for selected Date and Collector.",
      severity: "warning",
    });
    return;
  }

    // ✅ Get payload from function
  await preparePrintForRow(matchedRow, false);

  // ✅ Set payload AFTER it’s fully built

  // ✅ Then open preview
  setOpenPrintSelector(false);
};

  const handleSearchClick = () => {
    // Move whatever is typed in pendingSearchQuery into searchQuery
    // This triggers the filter in the useEffect
    setSearchQuery(pendingSearchQuery);
  };

  const handleConfirmDelete = async () => {
    if (selectedId === null || selectedId === undefined) {
      setOpenDeleteDialog(false);
      return;
    }

    setFilteredData((prev) =>
      prev.filter((row) => String(getRowId(row)) !== String(selectedId))
    );
    setOpenDeleteDialog(false);
    setSelectedId(null);
    setSelectedRow(null);
    setSnackbar({
      open: true,
      message: "Record removed from table.",
      severity: "success",
    });
  };

  const printCollectorOptions = Array.from(
    new Set((filteredData || []).map((row) => getCollectorFromRow(row)).filter(Boolean))
  );

  const printDateOptions = Array.from(
    new Set((filteredData || []).map((row) => toDateKey(getDateFromRow(row))).filter(Boolean))
  ).sort((a, b) => (a > b ? -1 : 1));

  return (
  
  <Box
   sx={{
        flexGrow: 1,
        padding: 3,
        minHeight: "100vh",
        }}>

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
                onClick={handleNewEntryClick}
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
                onClick={handleCheckStockClick}
              >
                Check Stock
              </Button>
            </Tooltip>

            {/* Inventory */}
            <Tooltip title="Generate Receipt Report" arrow>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ReceiptIcon size={16} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#e2138cff",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#d820dfff",
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
                onClick={handleInventoryClick}
              >
                Inventory
              </Button>
            </Tooltip>

            {/* Issue */}
            <Tooltip title="Generate Receipt Report" arrow>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ReceiptIcon size={16} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#e90712ff",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#df1a44ff",
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
                onClick={handleIssueFormClick}
              >
                Issue Form
              </Button>
            </Tooltip>

            {/* Purchase Form */}
            <Tooltip title="Financial Reports" arrow>
              <Button
                variant="contained"
                color="error"
                startIcon={<BiSolidReport size={18} />}
                onClick={handleOpenPurchaseForm}
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
                Purchase Form
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
                onClick={handleOpenAssignForm}
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
                Assign Form
              </Button>
            </Tooltip>

            {/* Print */}
            <Tooltip title="Print Report" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<IoMdPrint size={18} />}
                onClick={handleToolbarPrintClick}
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
                Print
              </Button>
            </Tooltip>

            {/* Logs */}
            <Tooltip title="Export Data" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<IoMdDownload size={18} />}
                onClick={handleLogsClick}
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
                Logs
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
              text: "Total Collection",
              icon: <AccountBalanceIcon />,
              gradient: "linear-gradient(135deg, #1976d2, #63a4ff)",
              onClick: handleClickTotal,
            },
            {
              value: taxOnBusinessTotal,
              text: "Collector 1",
              icon: <BusinessCenterIcon />,
              gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)",
              onClick: handleClickTax,
            },
            {
              value: regulatoryFeesTotal,
              text: "Collector 2",
              icon: <GavelIcon />,
              gradient: "linear-gradient(135deg, #ed6c02, #ffb74d)",
              onClick: handleClickRF,
            },
            {
              value: receiptsFromEconomicEnterprisesTotal,
              text: "Collector 3",
              icon: <StorefrontIcon />,
              gradient: "linear-gradient(135deg, #6a1b9a, #ab47bc)",
              onClick: handleClickRFEE,
            },
            {
              value: serviceUserChargesTotal,
              text: "Collector 4",
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


      {activeSection === "daily" && <DailyReport onBack={handleBackToMainTable} />}
      {activeSection === "check-stock" && <CheckStocks />}
      {activeSection === "inventory" && <Inventory onBack={handleBackToMainTable} />}
      {activeSection === "issue-form" && <IssueForm onBack={handleBackToMainTable} />}
      {activeSection === "logs" && <Logs />}

      {showMainTable && <TableContainer
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
                      <StyledTableCell>Name Of Collector</StyledTableCell>
                      <StyledTableCell>Type Of Receipt</StyledTableCell>
                      <StyledTableCell>Receipt No. From</StyledTableCell>
                      <StyledTableCell>Receipt No. To</StyledTableCell>
                      <StyledTableCell>TOTAL</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
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
                              {formatDate(row.issued_date || row.Date || row.date)}
                            </Typography>
                          </TableCell>
      
                          <TableCell align="center">
                            <Typography variant="body2">{row.Collector || row.collector}</Typography>
                          </TableCell>
      
                          <TableCell align="center">
                            <Typography variant="body2">{row.Type_Of_Receipt || row.type_of_receipt}</Typography>
                          </TableCell>
      
                          <TableCell align="center">
                            <Typography variant="body2">
                              {row.Receipt_No_From || row.receipt_no_from}
                            </Typography>
                          </TableCell>
      
                          <TableCell align="center">
                            <Typography variant="body2">
                              {row.Receipt_No_To || row.receipt_no_to}
                            </Typography>
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
                              }).format(Number(row.Total || row.total || 0))}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Chip
                              label={row.Status || row.status || "Not Remit"}
                              color="info"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
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
                    // onPageChange={handleChangePage}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Box>
              </TableContainer>}

               {/* Single menu for ACTIONS */}
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEditClick}>Update</MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event propagation
                          setSelectedId(getRowId(selectedRow));
                          setOpenDeleteDialog(true);
                          handleMenuClose();
                        }}
                      >
                        Delete
                      </MenuItem>
                      <MenuItem onClick={handleViewClick}>View</MenuItem>
                      <MenuItem onClick={handlePrintClick}>Print</MenuItem>
                    </Menu>
                    {/* Popup for "Add" or "View" content */}
                    <Dialog
                      open={isDialogOpen}
                      onClose={handleCloseDialog}
                      maxWidth="md"
                      fullWidth
                    >
                      <DialogTitle
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {dialogTitle || "Form"}
                        <IconButton onClick={handleCloseDialog} size="small" aria-label="close">
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </DialogTitle>
                      <DialogContent>{dialogContent}</DialogContent>
                    </Dialog>

                    <Dialog
                      open={openPrintPreview}
                      onClose={() => setOpenPrintPreview(false)}
                      maxWidth="lg"
                      fullWidth
                    >
                      <DialogContent>
                        <div ref={printPreviewRef}>
                          <RcdPrintTable
                            payload={printPayload}
                            onClose={() => setOpenPrintPreview(false)}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={openPrintSelector}
                      onClose={() => setOpenPrintSelector(false)}
                      maxWidth="xs"
                      fullWidth
                    >
                      <DialogTitle>Select Date and Collector</DialogTitle>
                      <DialogContent>
                        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
                          <TextField
                            select
                            label="Date"
                            value={printDate}
                            onChange={(e) => setPrintDate(e.target.value)}
                            fullWidth
                          >
                            {printDateOptions.map((dateKey) => (
                              <MenuItem key={dateKey} value={dateKey}>
                                {formatDate(dateKey)}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            select
                            label="Collector"
                            value={printCollector}
                            onChange={(e) => setPrintCollector(e.target.value)}
                            fullWidth
                          >
                            {printCollectorOptions.map((collector) => (
                              <MenuItem key={collector} value={collector}>
                                {collector}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenPrintSelector(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleConfirmToolbarPrint}>
                          Print
                        </Button>
                      </DialogActions>
                    </Dialog>
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
                   



    </Box>
  )
}

export default ReportCollectionDeposit
