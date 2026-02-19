import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";

function NewEntryForm({ onSaved, onCancel }) {
  const [formData, setFormData] = useState({
    issued_date: new Date().toISOString().split("T")[0],
    collector: "",
    type_of_receipt: "",
    receipt_no_from: "",
    receipt_no_to: "",
    total: "",
    status: "Not Remit",
  });
  const [issuedForms, setIssuedForms] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/issued-forms")
      .then((res) => setIssuedForms(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Failed to load issued forms:", err);
        setIssuedForms([]);
      });
  }, []);

  const collectors = useMemo(() => {
    const unique = new Set(
      issuedForms
        .filter((item) => String(item?.Status ?? item?.status ?? "").toUpperCase() === "ISSUED")
        .filter((item) => Number(item?.Stock ?? item?.stock ?? 0) > 0)
        .map((item) => item?.Collector ?? item?.collector)
        .filter(Boolean)
    );
    return Array.from(unique);
  }, [issuedForms]);

  const formTypes = useMemo(() => {
    const unique = new Set(
      issuedForms
        .filter((item) => (item?.Collector ?? item?.collector) === formData.collector)
        .filter((item) => String(item?.Status ?? item?.status ?? "").toUpperCase() === "ISSUED")
        .filter((item) => Number(item?.Stock ?? item?.stock ?? 0) > 0)
        .map((item) => item?.Form_Type ?? item?.form_type)
        .filter(Boolean)
    );
    return Array.from(unique);
  }, [issuedForms, formData.collector]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.post("/rcd-entries", {
        ...formData,
        receipt_no_from: Number(formData.receipt_no_from),
        receipt_no_to: Number(formData.receipt_no_to),
        total: Number(formData.total),
      });
      if (typeof onSaved === "function") {
        onSaved();
      }
    } catch (err) {
      console.error(err);
      const apiMessage = err?.response?.data?.message;
      alert(apiMessage || "Failed to save entry.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
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
          name="issued_date"
          value={formData.issued_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <TextField
          select
          label="Collector"
          name="collector"
          value={formData.collector}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              collector: e.target.value,
              type_of_receipt: "",
            }))
          }
          required
          fullWidth
        >
          {collectors.map((collector) => (
            <MenuItem key={collector} value={collector}>
              {collector}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Type of Receipt"
          name="type_of_receipt"
          value={formData.type_of_receipt}
          onChange={handleChange}
          required
          fullWidth
          disabled={!formData.collector}
        >
          {formTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Receipt No. From"
          type="number"
          name="receipt_no_from"
          value={formData.receipt_no_from}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Receipt No. To"
          type="number"
          name="receipt_no_to"
          value={formData.receipt_no_to}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Total"
          type="number"
          name="total"
          value={formData.total}
          onChange={handleChange}
          required
          fullWidth
          inputProps={{ min: 0, step: "0.01" }}
        />

        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="Remit">Remit</MenuItem>
          <MenuItem value="Not Remit">Not Remit</MenuItem>
          <MenuItem value="Deposit">Deposit</MenuItem>
          <MenuItem value="Approve">Approve</MenuItem>
          <MenuItem value="Purchase">Purchase</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 3 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Save Entry
        </Button>
      </Box>
    </Box>
  );
}

export default NewEntryForm;
