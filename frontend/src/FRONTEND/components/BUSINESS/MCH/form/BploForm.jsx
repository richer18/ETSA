import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Autocomplete,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Divider,
  Card,
  CardContent,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  PersonOutline as PersonIcon,
  DirectionsCarOutlined as CarIcon,
  AutorenewOutlined as RenewIcon,
  LocalAtmOutlined as PaymentIcon,
  CommentOutlined as CommentIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axiosInstance from "../../../../../api/axiosInstance";
import dayjs from "dayjs";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
}));

const ExpandButton = styled(IconButton)(({ expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: "transform 0.3s ease",
}));

export default function BploForm({ editData }) {
  const [expanded, setExpanded] = useState({
    owner: true,
    vehicle: false,
    payment: false,
    renewal: false,
    comment: false,
  });

  const toggleExpand = (section) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    DATE: "",
    TRANSACTION_CODE: "",
    FNAME: "",
    MNAME: "",
    LNAME: "",
    EXTNAME: "",
    GENDER: "",
    STREET: "",
    BARANGAY: "",
    MUNICIPALITY: "Zamboanguita",
    PROVINCE: "Negros Oriental",
    CELLPHONE: "",
    MCH_NO: "",
    FRANCHISE_NO: "",
    MAKE: "",
    MOTOR_NO: "",
    CHASSIS_NO: "",
    PLATE: "",
    COLOR: "",
    LTO_ORIGINAL_RECEIPT: "",
    LTO_CERTIFICATE_REGISTRATION: "",
    LTO_MV_FILE_NO: "",
    DRIVER: "",
    ORIGINAL_RECEIPT_PAYMENT: "",
    PAYMENT_DATE: "",
    AMOUNT: "",
    CEDULA_NO: "",
    CEDULA_DATE: "",
    RENEW_FROM: "",
    RENEW_TO: "",
    STATUS: "",
    MAYORS_PERMIT_NO: "",
    LICENSE_NO: "",
    LICENSE_VALID_DATE: "",
    COMMENT: "",
  });

  
const [makes, setMakes] = useState([]);
  //=======================LOAD MCH MAKE ===================================
 useEffect(() => {
  const fetchMakes = async () => {
    try {
      const { data } = await axiosInstance.get("/bplo/makes");
      setMakes(data.length ? data : ["HONDA", "YAMAHA", "SUZUKI", "KAWASAKI","RUSI", "SYM", "KYMCO", "SKYGO","CT125AE","OTHER"]);
    } catch (err) {
      console.error("❌ Failed to fetch makes:", err);
      // fallback list
      setMakes(["HONDA", "YAMAHA", "SUZUKI", "KAWASAKI", "RUSI", "SYM", "KYMCO", "SKYGO","CT125AE","OTHER"]);
    }
  };
  fetchMakes();
}, []);

  // ===================== LOAD REGISTERED MCH NUMBERS =====================
  const [registeredMchNumbers, setRegisteredMchNumbers] = useState([]);

  useEffect(() => {
    const fetchRegisteredMch = async () => {
      try {
        const { data } = await axiosInstance.get("bplo/registered-mch");
        setRegisteredMchNumbers(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch registered MCH numbers", err);
        setRegisteredMchNumbers([]);
      }
    };
    fetchRegisteredMch();
  }, []);

  // ===================== HANDLE EDIT DATA =====================
  useEffect(() => {
  if (editData) {
    setEditId(editData.ID);

    const formatDate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "");

    setForm((prev) => ({
      ...prev,
      ...editData,
      DATE: formatDate(editData.DATE),
      CEDULA_DATE: formatDate(editData.CEDULA_DATE),
      PAYMENT_DATE: formatDate(editData.PAYMENT_DATE),
      RENEW_FROM: formatDate(editData.RENEW_FROM),
      RENEW_TO: formatDate(editData.RENEW_TO),
      LICENSE_VALID_DATE: formatDate(editData.LICENSE_VALID_DATE),

      // ✅ Fix for dropdown case mismatch
      MAKE: editData.MAKE
        ? editData.MAKE.toUpperCase().trim()
        : "",
    }));
  } else {
    resetForm();
  }
}, [editData]);

  // ===================== AUTO-COMPUTE RENEW_TO + STATUS =====================
  useEffect(() => {
    if (form.RENEW_FROM) {
      const renewFrom = dayjs(form.RENEW_FROM);
      const renewTo = renewFrom.add(1, "year").format("YYYY-MM-DD");
      const isActive =
        dayjs().isBefore(dayjs(renewTo)) || dayjs().isSame(dayjs(renewTo));
      setForm((prev) => ({
        ...prev,
        RENEW_TO: renewTo,
        STATUS: isActive ? "ACTIVE" : "EXPIRED",
      }));
    } else {
      setForm((prev) => ({ ...prev, RENEW_TO: "", STATUS: "PENDING" }));
    }
  }, [form.RENEW_FROM]);

  // ===================== HANDLE CHANGE =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ===================== HANDLE SUBMIT =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.DATE) payload.DATE = dayjs().format("YYYY-MM-DD");

    try {
      if (editId) {
        await axiosInstance.put(`/bplo/${editId}`, payload);
        alert("✅ Record updated successfully!");
      } else {
        await axiosInstance.post("/bplo", payload);
        alert("✅ Record saved successfully!");
      }
      resetForm();
    } catch (err) {
      console.error("Save failed", err);
      alert("❌ Failed to save record. Check console.");
    }
  };

  // ===================== RESET FORM =====================
  const resetForm = () => {
    setEditId(null);
    setForm({
      DATE: "",
      TRANSACTION_CODE: "",
      FNAME: "",
      MNAME: "",
      LNAME: "",
      EXTNAME: "",
      GENDER: "",
      STREET: "",
      BARANGAY: "",
      MUNICIPALITY: "Zamboanguita",
      PROVINCE: "Negros Oriental",
      CELLPHONE: "",
      MCH_NO: "",
      FRANCHISE_NO: "",
      MAKE: "",
      MOTOR_NO: "",
      CHASSIS_NO: "",
      PLATE: "",
      COLOR: "",
      LTO_ORIGINAL_RECEIPT: "",
      LTO_CERTIFICATE_REGISTRATION: "",
      LTO_MV_FILE_NO: "",
      DRIVER: "",
      ORIGINAL_RECEIPT_PAYMENT: "",
      PAYMENT_DATE: "",
      AMOUNT: "",
      CEDULA_NO: "",
      CEDULA_DATE: "",
      RENEW_FROM: "",
      RENEW_TO: "",
      STATUS: "",
      MAYORS_PERMIT_NO: "",
      LICENSE_NO: "",
      LICENSE_VALID_DATE: "",
      COMMENT: "",
    });
  };


  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <form onSubmit={handleSubmit}>
        {/* ========== OWNER INFO ========== */}
        <StyledCard>
          <CardContent className="d-flex align-items-center">
            <PersonIcon color="primary" className="me-2" />
            <Typography variant="h6" className="flex-grow-1">
              Owner Information
            </Typography>
            <ExpandButton
              expand={expanded.owner}
              onClick={() => toggleExpand("owner")}
            >
              <ExpandMoreIcon />
            </ExpandButton>
          </CardContent>
          <Collapse in={expanded.owner}>
            <Divider />
            <CardContent>
              <div className="container-fluid">
                <div className="row g-3">
                  <div className="col-md-4">
                    <TextField
                      type="date"
                      label="Date"
                      name="DATE"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={form.DATE}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-8">
                    <TextField
                      label="Transaction Code"
                      name="TRANSACTION_CODE"
                      fullWidth
                      value={form.TRANSACTION_CODE}
                      onChange={handleChange}
                      helperText="Leave blank to auto-generate"
                    />
                  </div>

                  <div className="col-md-3">
                    <TextField
                      label="First Name"
                      name="FNAME"
                      fullWidth
                      value={form.FNAME}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      label="Middle Name"
                      name="MNAME"
                      fullWidth
                      value={form.MNAME}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      label="Last Name"
                      name="LNAME"
                      fullWidth
                      value={form.LNAME}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      label="Ext."
                      name="EXTNAME"
                      fullWidth
                      value={form.EXTNAME}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <Autocomplete
                      disableClearable
                      options={["MALE", "FEMALE"]}
                      value={form.GENDER || ""}
                      onChange={(e, v) => setForm((p) => ({ ...p, GENDER: v }))}
                      renderInput={(params) => (
                        <TextField {...params} label="Gender" fullWidth />
                      )}
                    />
                  </div>

                  <div className="col-md-5">
                    <TextField
                      label="Street"
                      name="STREET"
                      fullWidth
                      value={form.STREET}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <Autocomplete
                      disableClearable
                      options={[
                        "POBLACION",
                        "BASAC",
                        "CALANGO",
                        "LUTOBAN",
                        "MALONGCAY DIOT",
                        "MALUAY",
                        "MAYABON",
                        "NABAGO",
                        "NAJANDIG",
                        "NASIG-ID",
                      ]}
                      value={form.BARANGAY || ""}
                      onChange={(e, v) =>
                        setForm((p) => ({ ...p, BARANGAY: v }))
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Barangay" fullWidth />
                      )}
                    />
                  </div>

                  <div className="col-md-4">
                    <TextField
                      label="Municipality"
                      name="MUNICIPALITY"
                      fullWidth
                      value={form.MUNICIPALITY}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      label="Province"
                      name="PROVINCE"
                      fullWidth
                      value={form.PROVINCE}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      label="Cellphone"
                      name="CELLPHONE"
                      fullWidth
                      value={form.CELLPHONE}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Collapse>
        </StyledCard>

        {/* ========== VEHICLE INFO ========== */}
        <StyledCard>
          <CardContent className="d-flex align-items-center">
            <CarIcon color="primary" className="me-2" />
            <Typography variant="h6" className="flex-grow-1">
              Vehicle Information
            </Typography>
            <ExpandButton
              expand={expanded.vehicle}
              onClick={() => toggleExpand("vehicle")}
            >
              <ExpandMoreIcon />
            </ExpandButton>
          </CardContent>
          <Collapse in={expanded.vehicle}>
            <Divider />
            <CardContent>
              <div className="container-fluid">
                <div className="row g-3">
                {/* ===== MCH NO COMBO BOX ===== */}

      <div className="col-md-3">
  <TextField
    select
    label="MCH No"
    name="MCH_NO"
    fullWidth
    value={form.MCH_NO}
    onChange={handleChange}
  >
    <MenuItem value="">Select</MenuItem>

    {Array.from({ length: 163 }, (_, i) => {
      const num = String(i + 1).padStart(3, "0");

      // ✅ Hide taken MCH numbers
      const isTaken =
        registeredMchNumbers.includes(num) && num !== form.MCH_NO;

      if (isTaken) return null; // ✅ Skip taken numbers entirely

      return (
        <MenuItem key={num} value={num}>
          {num}
        </MenuItem>
      );
    })}
  </TextField>
</div>
                  {[
                    ["FRANCHISE_NO", "Franchise No"],
                    ["MOTOR_NO", "Motor No"],
                    ["CHASSIS_NO", "Chassis No"],
                    ["PLATE", "Plate"],
                    ["COLOR", "Color"],
                    ["LTO_ORIGINAL_RECEIPT", "LTO OR"],
                    ["LTO_CERTIFICATE_REGISTRATION", "LTO CR"],
                    ["LTO_MV_FILE_NO", "MV. FILE NO"],
                    ["DRIVER", "Driver"],
                  ].map(([field, label]) => (
                    <div className="col-md-3" key={field}>
                      <TextField
                        label={label}
                        name={field}
                        fullWidth
                        value={form[field]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}

                  <div className="col-md-3">
                    <TextField
  select
  label="Make"
  name="MAKE"
  fullWidth
  value={form.MAKE || ""}
  onChange={handleChange}
>
  <MenuItem value="">Select</MenuItem>
  {makes.map((m) => (
    <MenuItem key={m} value={m}>
      {m}
    </MenuItem>
  ))}
</TextField>
                  </div>
                </div>
              </div>
            </CardContent>
          </Collapse>
        </StyledCard>

        {/* ========== PAYMENT & CEDULA ========== */}
        <StyledCard>
          <CardContent className="d-flex align-items-center">
            <PaymentIcon color="primary" className="me-2" />
            <Typography variant="h6" className="flex-grow-1">
              Payment & Cedula
            </Typography>
            <ExpandButton
              expand={expanded.payment}
              onClick={() => toggleExpand("payment")}
            >
              <ExpandMoreIcon />
            </ExpandButton>
          </CardContent>
          <Collapse in={expanded.payment}>
            <Divider />
            <CardContent>
              <div className="container-fluid">
                <div className="row g-3">
                  <div className="col-md-3">
                    <TextField
                      label="O.R. Payment"
                      name="ORIGINAL_RECEIPT_PAYMENT"
                      fullWidth
                      value={form.ORIGINAL_RECEIPT_PAYMENT}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      type="date"
                      label="Payment Date"
                      name="PAYMENT_DATE"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={form.PAYMENT_DATE}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      label="Amount"
                      name="AMOUNT"
                      fullWidth
                      value={form.AMOUNT}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      label="Cedula No"
                      name="CEDULA_NO"
                      fullWidth
                      value={form.CEDULA_NO}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      type="date"
                      label="Cedula Date"
                      name="CEDULA_DATE"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={form.CEDULA_DATE}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Collapse>
        </StyledCard>

        {/* ========== RENEWAL & LICENSE ========== */}
        <StyledCard>
          <CardContent className="d-flex align-items-center">
            <RenewIcon color="primary" className="me-2" />
            <Typography variant="h6" className="flex-grow-1">
              Renewal & License
            </Typography>
            <ExpandButton
              expand={expanded.renewal}
              onClick={() => toggleExpand("renewal")}
            >
              <ExpandMoreIcon />
            </ExpandButton>
          </CardContent>
          <Collapse in={expanded.renewal}>
            <Divider />
            <CardContent>
              <div className="container-fluid">
                <div className="row g-3">
                  <div className="col-md-4">
                    <TextField
                      type="date"
                      label="Renew From"
                      name="RENEW_FROM"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={form.RENEW_FROM}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      type="date"
                      label="Renew To"
                      name="RENEW_TO"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={form.RENEW_TO}
                      disabled
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      label="Status"
                      name="STATUS"
                      fullWidth
                      value={form.STATUS}
                      disabled
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      label="Mayor’s Permit No"
                      name="MAYORS_PERMIT_NO"
                      fullWidth
                      value={form.MAYORS_PERMIT_NO}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      label="License No"
                      name="LICENSE_NO"
                      fullWidth
                      value={form.LICENSE_NO}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      type="date"
                      label="License Valid Date"
                      name="LICENSE_VALID_DATE"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={form.LICENSE_VALID_DATE}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Collapse>
        </StyledCard>

        {/* ========== COMMENTS & ACTIONS ========== */}
        <StyledCard>
          <CardContent className="d-flex align-items-center">
            <CommentIcon color="primary" className="me-2" />
            <Typography variant="h6" className="flex-grow-1">
              Remarks / Comments
            </Typography>
            <ExpandButton
              expand={expanded.comment}
              onClick={() => toggleExpand("comment")}
            >
              <ExpandMoreIcon />
            </ExpandButton>
          </CardContent>
          <Collapse in={expanded.comment}>
            <Divider />
            <CardContent>
              <TextField
                label="Remarks / Comment"
                name="COMMENT"
                fullWidth
                multiline
                rows={3}
                value={form.COMMENT}
                onChange={handleChange}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button variant="outlined" color="secondary" onClick={resetForm}>
                  Reset
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {editId ? "Update Record" : "Save Record"}
                </Button>
              </Box>
            </CardContent>
          </Collapse>
        </StyledCard>
      </form>
    </Box>
  );
}
