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

const groupIssuedForms = (rows) => {
  const groups = new Map();

  for (const row of rows) {
    const formType = pick(row, ['Form_Type', 'form_type']);
    const serialNo = pick(row, ['Serial_No', 'serial_no']);
    const collector = pick(row, ['Collector', 'collector']);
    const rowDate = pick(row, ['Date', 'date', 'Date_Issued', 'date_issued']);
    const rangeFrom = pick(row, ['Receipt_Range_From', 'receipt_range_from']);
    const rangeTo = pick(row, ['Receipt_Range_To', 'receipt_range_to']);
    const stock = pick(row, ['Stock', 'stock']);
    const status = pick(row, ['Status', 'status']);
    const rowId = pick(row, ['ID', 'id']);

    const key = `${collector}__${formType}__${serialNo}`;
    const parsedDate = rowDate ? dayjs(rowDate) : null;
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        rowDate,
        earliestDate: parsedDate,
        formType,
        serialNo,
        rangeFrom,
        rangeTo,
        collector,
        stock,
        status,
        rowId,
        latestDate: parsedDate,
      });
      continue;
    }

    if (parsedDate && (!existing.earliestDate || parsedDate.isBefore(existing.earliestDate))) {
      existing.earliestDate = parsedDate;
      existing.rowDate = rowDate;
    }

    if (parsedDate && (!existing.latestDate || parsedDate.isAfter(existing.latestDate))) {
      existing.latestDate = parsedDate;
      existing.stock = stock;
      existing.status = status;
      existing.rowId = rowId || existing.rowId;
    }

    if ((existing.rangeFrom === '' || existing.rangeFrom === 0 || existing.rangeFrom === '0') && rangeFrom !== '') {
      existing.rangeFrom = rangeFrom;
    }
    if ((existing.rangeTo === '' || existing.rangeTo === 0 || existing.rangeTo === '0') && rangeTo !== '') {
      existing.rangeTo = rangeTo;
    }
  }

  return Array.from(groups.values()).sort((a, b) => {
    const aTime = a?.earliestDate?.isValid?.() ? a.earliestDate.valueOf() : 0;
    const bTime = b?.earliestDate?.isValid?.() ? b.earliestDate.valueOf() : 0;
    return bTime - aTime;
  });
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

  const displayRows = groupIssuedForms(data);

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
            {displayRows.map((row, index) => {
              return (
                <StyledTableRow key={row.rowId || `${row.serialNo}-${index}`}>
                  <CenteredTableCell>{row.rowDate ? dayjs(row.rowDate).format('MMM D, YYYY') : '-'}</CenteredTableCell>
                  <CenteredTableCell>{row.formType || '-'}</CenteredTableCell>
                  <CenteredTableCell>{row.serialNo || '-'}</CenteredTableCell>
                  <CenteredTableCell>{row.rangeFrom !== '' ? row.rangeFrom : '-'}</CenteredTableCell>
                  <CenteredTableCell>{row.rangeTo !== '' ? row.rangeTo : '-'}</CenteredTableCell>
                  <CenteredTableCell>{row.collector || '-'}</CenteredTableCell>
                  <CenteredTableCell>{row.stock !== '' ? row.stock : '-'}</CenteredTableCell>
                  <CenteredTableCell>{row.status || '-'}</CenteredTableCell>
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
