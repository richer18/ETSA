import React from 'react'
import {
  Autocomplete,
  // Badge,
  Box,
  Button,
  // Dialog,
  // DialogContent,
  // DialogTitle,
  // IconButton,
  // Menu,
  // MenuItem,
  // Paper,
  // styled,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  TextField, Typography
} from '@mui/material';


function DailyReport({ onBack }) {
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
        Daily Report of Collection and Deposit
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

    </>
  )
}

export default DailyReport
