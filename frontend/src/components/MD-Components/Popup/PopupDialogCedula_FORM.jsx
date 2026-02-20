import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import { Button } from "@mui/material";

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
          backgroundColor: "#f5f5f5", // Light gray background
          color: "#333", // Dark text color
          borderRadius: "12px", // Rounded corners
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", // Soft shadow effect
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#0080A7", // Dark blue header
          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
        }}
      >
        Community Tax Certificate Form
        <Button onClick={onClose} variant="contained" color="error">
          Close
        </Button>
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 1, sm: 2 },
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
