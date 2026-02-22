import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import React from "react";

function PopupDialog({ onClose, children }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#f7f9fc",
          color: "#0f172a",
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
          background:
            "linear-gradient(135deg, #0b1f33 0%, #17324f 55%, #1f3d5e 100%)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ letterSpacing: 2, color: "#f5e7c1" }}>
            Real Property Tax Abstract
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.4 }}>
            Real Property Tax Form - Official Use
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, color: "#e3ecf7" }}>
            Office of the Treasurer
          </Typography>
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

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>{children}</DialogContent>
    </Dialog>
  );
}

PopupDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default PopupDialog;
