import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function PopupDialog({ onClose, children }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: "min(98vw, 1220px)",
          maxWidth: "1220px",
          margin: { xs: 1, sm: 2 },
          borderRadius: "16px",
          border: "1px solid #d6a12b",
          boxShadow: "0 20px 40px rgba(10, 18, 30, 0.35)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 2.5 },
          background: "linear-gradient(135deg, #0b1f33 0%, #17324f 55%, #1f3d5e 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 2, color: "#f5e7c1" }}>
              Community Tax Certificate
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.4 }}>
              Cedula Form • Official Use
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, color: "#e3ecf7" }}>
              Office of the Treasurer
            </Typography>
          </Box>
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Box
              component="img"
              src="/assets/images/TreasurerPNG.png"
              alt="Treasurer Seal"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Box>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{
            color: "#f8e1a6",
            borderColor: "#d6a12b",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              borderColor: "#f2cf74",
              backgroundColor: "rgba(214, 161, 43, 0.12)",
            },
          }}
        >
          Close
        </Button>
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          backgroundColor: "#f7f9fc",
          overflowX: "auto",
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

// Prop types validation
PopupDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default PopupDialog;
