import {
  Autocomplete,
  Badge,
  Box,
  Button,
  // Dialog,
  // DialogContent,
  // DialogTitle,
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
  TextField, Typography
} from '@mui/material';

// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../../api/axiosInstance'; // adjust path

import VisibilityIcon from '@mui/icons-material/Visibility';

import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
// import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// import axios from "../../../../../api/axiosInstance";
// import CommentsDialog from '../../RPT/TableData/CommentsDialog';
// import DailyTablev2 from './components/Table/DailyTable';

// Styled components for the table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const RightAlignedTableCell = styled(TableCell)({
  textAlign: 'right',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const CenteredTableCell = styled(TableCell)({
  textAlign: 'center',
});

const months = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const years = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
  { label: '2029', value: '2029' },
  { label: '2030', value: '2030' },
];


 const formatDate = (dateInput) => {
    if (!dateInput) return 'Invalid Date';
    let date;
    if (typeof dateInput === 'string') {
      date = parseISO(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return 'Invalid Date';
    }
    if (isNaN(date)) return 'Invalid Date';
    return format(date, 'MMMM d, yyyy');
  };


function Inventory({ onDataFiltered, onBack }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axiosInstance.get('/purchases')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error('Failed to fetch inventory:', err);
            });
    }, []);

    // const [currentRow, setCurrentRow] = useState(null);
    // const [anchorEl, setAnchorEl] = useState(null);
    // const [selectedMonth, setSelectedMonth] = useState('');
    // const [selectedYear, setSelectedYear] = useState('');
    // const [viewOpen, setViewOpen] = useState(false);
    // const [viewData, setViewData] = useState([]);
    // const [comments, setComments] = useState([]);
    // const [commentCounts, setCommentCounts] = useState({});
    // const [openCommentDialog, setOpenCommentDialog] = useState(false);
  return (
    <>
      {/* Month and Year selectors */}
      <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 2,
      mb: 4,
      p: 3,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1
    }}>
      <Button 
      variant="contained" 
      // startIcon={<ArrowBackIcon />}
      onClick={() => onBack?.()}
      sx={{ 
        borderRadius: '8px',
        textTransform: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
      }}
    >
        Back
      </Button>
      
      <Typography variant="h4" sx={{ 
        fontWeight: 700,
        color: 'primary.main',
        letterSpacing: 1
      }}>
        Accountable Forms Inventory
      </Typography>
      
      <Box display="flex" gap={2} alignItems="center">
      <Autocomplete
      disablePortal
      id="month-selector"
      // options={months}
      sx={{ width: 150, mr: 2 }}
      // onChange={handleMonthChange}
      renderInput={(params) => <TextField {...params} label="Month" />}
    />
    <Autocomplete
      disablePortal
      id="year-selector"
      // options={years}
      sx={{ width: 150 }}
      // onChange={handleYearChange}
      renderInput={(params) => <TextField {...params} label="Year" />}
    />
      </Box>
    </Box>

     {/* Table display */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          '& .MuiTableCell-root': {
            py: 2
          }
        }}
      >
      <Table aria-label="daily data table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>DATE</StyledTableCell>
            <StyledTableCell>Form Name</StyledTableCell>
            <StyledTableCell>Serial No.</StyledTableCell>
            <StyledTableCell>Receipt Range From</StyledTableCell>
            <StyledTableCell>Receipt Range To</StyledTableCell>
            <StyledTableCell>Stock</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>ACTION</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
  {data.map((row, index) => (
    <StyledTableRow key={row.ID || index}>
      <CenteredTableCell>{dayjs(row.purchase_date).format('MMM D, YYYY')}</CenteredTableCell>
      <CenteredTableCell>{row.form_type }</CenteredTableCell>
      <CenteredTableCell>{row.serial_no }</CenteredTableCell>
      <CenteredTableCell>{row.receipt_range_from}</CenteredTableCell>
      <CenteredTableCell>{row.receipt_range_to}</CenteredTableCell>
      <CenteredTableCell>{row.stock}</CenteredTableCell>
      <CenteredTableCell>{row.status}</CenteredTableCell>
      <CenteredTableCell>
        <IconButton>
          <VisibilityIcon color="primary" />
        </IconButton>
      </CenteredTableCell>
    </StyledTableRow>
  ))}
</TableBody>
      </Table>
    </TableContainer>

    </>
  )
}

export default Inventory
