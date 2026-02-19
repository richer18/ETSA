import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

function PopupDialog({ onClose, children }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md" // Adjust dialog width
      fullWidth // Make it take full width
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
        General Fund Abstracts Form
        <Button onClick={onClose} variant="contained" color="error">
          Close
        </Button>
      </DialogTitle>

      <DialogContent sx={{ padding: "20px 24px" }}>{children}</DialogContent>
    </Dialog>
  );
}

// Prop types validation
PopupDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default PopupDialog;
