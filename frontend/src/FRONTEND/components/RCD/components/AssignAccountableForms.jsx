import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstance from "../../../../api/axiosInstance";

const collectors = [
  { name: "Flora My D. Ferrer" },
  { name: "Agnes Ello" },
  { name: "Ricardo T. Enopia" },
  { name: "Emily E. Credo" },
];

const sortBySerialNo = (a, b) =>
  String(a?.serial_no ?? "").localeCompare(String(b?.serial_no ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });

function AssignAccountableForms({ onClose }) {
  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split("T")[0],
    Collector: "",
    Form_Type: "",
    Serial_No: "",
    Receipt_Range_From: "",
    Receipt_Range_To: "",
    Issued_receipt_qty: 50,
    Stock: 50,
    Status: "ISSUED",
  });

  const [availableForms, setAvailableForms] = useState([]);

  useEffect(() => {
  axiosInstance.get('/available-forms')
    .then(res => setAvailableForms(res.data))
    .catch(err => console.error(err));
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...formData, [name]: value, Issued_receipt_qty: 50, Stock: 50 };

    if (name === "Receipt_Range_From") {
      const from = Number(value);
      nextForm.Receipt_Range_To =
        Number.isFinite(from) && from > 0 ? String(from + 49) : "";
    }

    setFormData(nextForm);
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  axiosInstance.post('/assign-forms', formData)
    .then(res => {
      alert('Form assigned successfully!');

      // Update inventory: mark the assigned Purchase Accountable Form as USED
      axiosInstance.put(`/update-purchase-form/${formData.Serial_No}`, { Status: 'USED' })
        .then(() => {
          // Refresh available forms
          axiosInstance.get('/available-forms')
            .then(res => setAvailableForms(res.data));
        });

  
    })
    .catch(err => {
      console.error(err);
      const apiMessage = err?.response?.data?.error || err?.response?.data?.message;
      alert(apiMessage ? `Failed to assign form: ${apiMessage}` : 'Failed to assign form.');
    });
};

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        mt: 1,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Assign Accountable Form
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Assign 50 receipt forms to a collector.
          </Typography>
        </Box>
        <Chip
          label="Qty: 50"
          sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700 }}
        />
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary" }}>
          Assignment Details
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Date"
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Autocomplete
  options={collectors}
  getOptionLabel={(option) => option.name}
  value={collectors.find((c) => c.name === formData.Collector) || null}
  onChange={(e, newValue) =>
    setFormData({ ...formData, Collector: newValue?.name || "" })
  }
  renderInput={(params) => <TextField {...params} label="Collector" required />}
/>

         <TextField
  select
  label="Form Type"
  name="Form_Type"
  value={formData.Form_Type}
  onChange={(e) => {
    const selectedType = e.target.value;
    const formsByType = availableForms
      .filter((f) => f.form_type === selectedType)
      .sort(sortBySerialNo);
    const firstFormInOrder = formsByType[0];

    setFormData((prev) => ({
      ...prev,
      Form_Type: selectedType,
      Serial_No: firstFormInOrder?.serial_no || "",
      Receipt_Range_From: firstFormInOrder?.receipt_range_from || "",
      Receipt_Range_To: firstFormInOrder?.receipt_range_to || "",
      Stock: firstFormInOrder?.stock ?? 50,
    }));
  }}
  fullWidth
  required
>
  {Array.from(new Set(availableForms.map(f => f.form_type))).map((type) => (
    <MenuItem key={type} value={type}>{type}</MenuItem>
  ))}
</TextField>

         <TextField
  select
  label="Serial No."
  name="Serial_No"
  value={formData.Serial_No}
  onChange={(e) => {
    const selectedSerial = e.target.value;
    const form = availableForms.find(f => f.serial_no === selectedSerial);

    if (form) {
      setFormData(prev => ({
        ...prev,
        Serial_No: form.serial_no,
        Receipt_Range_From: form.receipt_range_from,
        Receipt_Range_To: form.receipt_range_to,
        Stock: form.stock,
      }));
    }
  }}
  fullWidth
  required
>
  {availableForms
    .filter(f => f.form_type === formData.Form_Type) // only show serials for selected Form Type
    .sort(sortBySerialNo)
    .map(f => (
      <MenuItem key={f.serial_no} value={f.serial_no}>
        {f.serial_no}
      </MenuItem>
    ))}
</TextField>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary" }}>
          Receipt Range
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
  label="Receipt Range From"
  name="receipt_range_from"
  value={formData.Receipt_Range_From}
  InputProps={{ readOnly: true }}
  fullWidth
/>

<TextField
  label="Receipt Range To"
  name="receipt_range_to"
  value={formData.Receipt_Range_To}
  InputProps={{ readOnly: true }}
  fullWidth
/>

          <TextField
            label="Issued Qty / Stock"
            name="stock"
            value={formData.Stock}
            InputProps={{ readOnly: true }}
            fullWidth
            helperText="Fixed value"
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 3 }}>
          <Button type="submit" variant="contained" size="large" sx={{ px: 4, fontWeight: 700 }}>
            Assign Form
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default AssignAccountableForms;
