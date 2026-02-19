import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axiosInstance from '../../../../api/axiosInstance';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
}));

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

const pick = (row, keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') {
      return row[key];
    }
  }
  return '';
};

function IssueForm({ onBack }) {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/issued-forms', {
        params: {
          month: selectedMonth?.value,
          year: selectedYear?.value,
        },
      })
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('Failed to fetch issued forms:', err);
        setData([]);
      });
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 4,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => onBack?.()}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
          }}
        >
          Back
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: 1,
          }}
        >
          Issued Forms
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <Autocomplete
            disablePortal
            id="month-selector"
            options={months}
            value={selectedMonth}
            sx={{ width: 150, mr: 2 }}
            onChange={(event, value) => setSelectedMonth(value)}
            renderInput={(params) => <TextField {...params} label="Month" />}
          />
          <Autocomplete
            disablePortal
            id="year-selector"
            options={years}
            value={selectedYear}
            sx={{ width: 150 }}
            onChange={(event, value) => setSelectedYear(value)}
            renderInput={(params) => <TextField {...params} label="Year" />}
          />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          '& .MuiTableCell-root': {
            py: 2,
          },
        }}
      >
        <Table aria-label="issued forms table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>DATE</StyledTableCell>
              <StyledTableCell>Form Name</StyledTableCell>
              <StyledTableCell>Serial No.</StyledTableCell>
              <StyledTableCell>Receipt Range From</StyledTableCell>
              <StyledTableCell>Receipt Range To</StyledTableCell>
              <StyledTableCell>Collector</StyledTableCell>
              <StyledTableCell>Stock</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>ACTION</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const rowDate = pick(row, ['Date', 'date', 'Date_Issued', 'date_issued']);
              const formType = pick(row, ['Form_Type', 'form_type']);
              const serialNo = pick(row, ['Serial_No', 'serial_no']);
              const rangeFrom = pick(row, ['Receipt_Range_From', 'receipt_range_from']);
              const rangeTo = pick(row, ['Receipt_Range_To', 'receipt_range_to']);
              const collector = pick(row, ['Collector', 'collector']);
              const stock = pick(row, ['Stock', 'stock']);
              const status = pick(row, ['Status', 'status']);

              return (
                <StyledTableRow key={pick(row, ['id', 'ID']) || `${serialNo}-${index}`}>
                  <CenteredTableCell>{rowDate ? dayjs(rowDate).format('MMM D, YYYY') : '-'}</CenteredTableCell>
                  <CenteredTableCell>{formType || '-'}</CenteredTableCell>
                  <CenteredTableCell>{serialNo || '-'}</CenteredTableCell>
                  <CenteredTableCell>{rangeFrom || '-'}</CenteredTableCell>
                  <CenteredTableCell>{rangeTo || '-'}</CenteredTableCell>
                  <CenteredTableCell>{collector || '-'}</CenteredTableCell>
                  <CenteredTableCell>{stock || '-'}</CenteredTableCell>
                  <CenteredTableCell>{status || '-'}</CenteredTableCell>
                  <CenteredTableCell>
                    <IconButton>
                      <VisibilityIcon color="primary" />
                    </IconButton>
                  </CenteredTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default IssueForm;
